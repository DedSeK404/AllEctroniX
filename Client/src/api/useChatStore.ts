import { create } from "zustand";
import { chatService, Conversation, Message } from "./chatService";

interface WebSocketPayload {
  content: string;
  conversation_id?: string;
  image_base64?: string;
}

interface ChatStore {
  // State
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  isStreaming: boolean;
  isLoading: boolean;
  socket: WebSocket | null;

  // Actions
  fetchConversations: () => Promise<void>;
  selectConversation: (conversationId: string) => Promise<void>;
  startNewChat: () => void;
  deleteConversation: (conversationId: string) => Promise<void>;

  // Real-time WebSocket setup & sending
  initWebSocket: (userId: number | string) => void;
  disconnectWebSocket: () => void;
  sendMessage: (content: string, imageBase64?: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isStreaming: false,
  isLoading: false,
  socket: null,

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const data = await chatService.getConversations();
      set({ conversations: data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      set({ isLoading: false });
    }
  },

  selectConversation: async (conversationId: string) => {
    set({ activeConversationId: conversationId, isLoading: true });
    try {
      const history = await chatService.getMessages(conversationId);
      set({ messages: history, isLoading: false });
    } catch (error) {
      console.error("Failed to load conversation history:", error);
      set({ isLoading: false });
    }
  },

  startNewChat: () => {
    set({ activeConversationId: null, messages: [] });
  },

  deleteConversation: async (conversationId: string) => {
    try {
      await chatService.deleteConversation(conversationId);
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== conversationId),
        activeConversationId:
          state.activeConversationId === conversationId ? null : state.activeConversationId,
        messages: state.activeConversationId === conversationId ? [] : state.messages,
      }));
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  },

  initWebSocket: (userId: number | string) => {
    const numericUserId = typeof userId === "string" ? parseInt(userId, 10) : userId;

    if (isNaN(numericUserId) || numericUserId <= 0) {
      console.error("Invalid userId passed to initWebSocket:", userId);
      return;
    }

    const currentWs = get().socket;

    // Prevent duplicate connection if already open or connecting
    if (
      currentWs &&
      (currentWs.readyState === WebSocket.OPEN ||
        currentWs.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    // Clean up closed or stale socket before opening a new one
    if (currentWs) {
      currentWs.onclose = null;
      currentWs.close();
    }

    const wsUrl = chatService.createWebSocketUrl(numericUserId);
    console.log("Connecting to WebSocket:", wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("✅ WebSocket connection established.");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "STREAM_CHUNK": {
            set({ isStreaming: true });

            if (get().activeConversationId !== data.conversation_id) {
              set({ activeConversationId: data.conversation_id });
            }

            set((state) => {
              const lastMsg = state.messages[state.messages.length - 1];

              // If the last message is already the active assistant stream, append to it
              if (lastMsg && lastMsg.sender === "assistant") {
                const updatedMessages = [...state.messages];
                updatedMessages[updatedMessages.length - 1] = {
                  ...lastMsg,
                  content: lastMsg.content + data.delta,
                };
                return { messages: updatedMessages };
              } else {
                // Generate a unique ID per response stream to prevent React key collisions
                const newAssistantMsg: Message = {
                  id: `stream-assistant-${Date.now()}`,
                  conversation_id: data.conversation_id,
                  sender: "assistant",
                  content: data.delta,
                  created_at: new Date().toISOString(),
                };
                return { messages: [...state.messages, newAssistantMsg] };
              }
            });
            break;
          }

          case "STREAM_END": {
            set({ isStreaming: false, isLoading: false });
            get().fetchConversations();
            break;
          }

          case "ERROR": {
            console.error("WebSocket server error:", data.message);
            set({ isStreaming: false, isLoading: false });
            break;
          }
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onclose = (event) => {
      console.warn(`⚠️ WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
      set({ socket: null, isStreaming: false, isLoading: false });
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
      set({ isStreaming: false, isLoading: false });
    };

    set({ socket: ws });
  },

  disconnectWebSocket: () => {
    const ws = get().socket;
    if (ws) {
      ws.onclose = null; // Detach listeners to prevent state leaks during unmount
      ws.close();
      set({ socket: null, isStreaming: false, isLoading: false });
    }
  },

  sendMessage: (content: string, imageBase64?: string) => {
    const ws = get().socket;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("Cannot send message: WebSocket is not open.");
      set({ isStreaming: false, isLoading: false });
      return;
    }

    const { activeConversationId } = get();

    // 1. Optimistically append User Message to UI state
    const optimisticUserMsg: Message = {
      id: `user-${Date.now()}`,
      conversation_id: activeConversationId || "temp",
      sender: "user",
      content,
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, optimisticUserMsg],
      isStreaming: true,
    }));

    // 2. Dispatch payload via WebSocket
    const payload: WebSocketPayload = {
      content,
      conversation_id: activeConversationId || undefined,
      image_base64: imageBase64,
    };

    ws.send(JSON.stringify(payload));
  },
}));