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
  hasMore: boolean;
  nextCursor: number | string | null;
  isLoadingMore: boolean;
  isStreaming: boolean;
  isLoading: boolean;
  socket: WebSocket | null;

  // Actions
  fetchConversations: () => Promise<void>;
  selectConversation: (conversationId: string) => Promise<void>;
  fetchOlderMessages: () => Promise<void>;
  startNewChat: () => void;
  deleteConversation: (conversationId: string) => Promise<void>;

  // Real-time WebSocket setup & sending
  initWebSocket: (userId: number | string) => void;
  disconnectWebSocket: () => void;
  sendMessage: (content: string, imageBase64?: string) => void;

  // Clear store state on logout
  reset: () => void;
}

const initialChatState = {
  conversations: [],
  activeConversationId: null,
  messages: [],
  hasMore: false,
  nextCursor: null,
  isLoadingMore: false,
  isStreaming: false,
  isLoading: false,
  socket: null,
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialChatState,

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
    set({
      activeConversationId: conversationId,
      isLoading: true,
      hasMore: false,
      nextCursor: null,
    });
    try {
      const data = await chatService.getMessages(conversationId);
      set({
        messages: data.messages || [],
        hasMore: data.has_more ?? false,
        nextCursor: data.next_cursor ?? null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load conversation history:", error);
      set({ isLoading: false });
    }
  },

  fetchOlderMessages: async () => {
    const { activeConversationId, nextCursor, hasMore, isLoadingMore } = get();

    if (!activeConversationId || !nextCursor || !hasMore || isLoadingMore) {
      return;
    }

    set({ isLoadingMore: true });

    try {
      const data = await chatService.getMessages(activeConversationId, nextCursor);

      set((state) => ({
        messages: [...(data.messages || []), ...state.messages],
        hasMore: data.has_more ?? false,
        nextCursor: data.next_cursor ?? null,
        isLoadingMore: false,
      }));
    } catch (error) {
      console.error("Failed to fetch older messages:", error);
      set({ isLoadingMore: false });
    }
  },

  startNewChat: () => {
    set({
      activeConversationId: null,
      messages: [],
      hasMore: false,
      nextCursor: null,
    });
  },

  deleteConversation: async (conversationId: string) => {
    try {
      await chatService.deleteConversation(conversationId);
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== conversationId),
        activeConversationId:
          state.activeConversationId === conversationId ? null : state.activeConversationId,
        messages: state.activeConversationId === conversationId ? [] : state.messages,
        hasMore: state.activeConversationId === conversationId ? false : state.hasMore,
        nextCursor: state.activeConversationId === conversationId ? null : state.nextCursor,
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

    if (
      currentWs &&
      (currentWs.readyState === WebSocket.OPEN ||
        currentWs.readyState === WebSocket.CONNECTING)
    ) {
      return;
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

              if (lastMsg && lastMsg.sender === "assistant") {
                const updatedMessages = [...state.messages];
                updatedMessages[updatedMessages.length - 1] = {
                  ...lastMsg,
                  content: lastMsg.content + data.delta,
                };
                return { messages: updatedMessages };
              } else {
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
            set((state) => {
              const updatedMessages = state.messages.map((msg, index) => {
                if (index === state.messages.length - 1 && msg.sender === "assistant") {
                  return {
                    ...msg,
                    id: data.message_id || msg.id,
                    metadata: data.metadata || msg.metadata,
                  };
                }
                return msg;
              });

              return {
                messages: updatedMessages,
                isStreaming: false,
                isLoading: false,
              };
            });

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
    if (!ws) return;

    set({ socket: null, isStreaming: false, isLoading: false });

    ws.onopen = null;
    ws.onmessage = null;
    ws.onerror = null;

    if (ws.readyState === WebSocket.CONNECTING) {
      ws.onclose = null;
      ws.onopen = () => {
        ws.close(1000, "Component unmounted during connection phase");
      };
    } else if (ws.readyState === WebSocket.OPEN) {
      ws.onclose = null;
      ws.close(1000, "Component unmounted");
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

    const optimisticUserMsg: Message = {
      id: `user-${Date.now()}`,
      conversation_id: activeConversationId || "temp",
      sender: "user",
      content,
      image_url: imageBase64,
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, optimisticUserMsg],
      isStreaming: true,
    }));

    const payload: WebSocketPayload = {
      content,
      conversation_id: activeConversationId || undefined,
      image_base64: imageBase64,
    };

    ws.send(JSON.stringify(payload));
  },

  reset: () => {
    get().disconnectWebSocket();
    set(initialChatState);
  },
}));