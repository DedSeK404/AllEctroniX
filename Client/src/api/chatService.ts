import apiClient from "./Client";

export interface Message {
  id: string;
  conversation_id: string;
  sender: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: number;
  title: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export const chatService = {
  // Fetch active conversations
  getConversations: async (): Promise<Conversation[]> => {
    const response = await apiClient.get<Conversation[]>("/chat/conversations");
    return response.data;
  },

  // Fetch message history for a specific conversation
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>(
      `/chat/conversations/${conversationId}/messages`
    );
    return response.data;
  },

  // Soft delete a conversation session
  deleteConversation: async (conversationId: string): Promise<void> => {
    await apiClient.delete(`/chat/conversations/${conversationId}`);
  },

  // Helper to construct WebSocket connection URL with user_id query param
  createWebSocketUrl: (userId: number): string => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = "127.0.0.1:8000"; // Or process.env.REACT_APP_WS_URL
    return `${protocol}//${host}/api/chat/ws?user_id=${userId}`;
  },
};

