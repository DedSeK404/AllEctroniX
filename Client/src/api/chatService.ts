import apiClient from "./Client";

export interface Message {
  id: string;
  conversation_id: string;
  sender: "user" | "assistant";
  content: string;
  created_at?: string;
  image_url?: string;
  image_base64?: string;
  metadata?: {
    matched_products?: Array<{
      id?: string | number;
      name?: string;
      part_number?: string;
      price?: number | string;
      in_stock?: boolean;
      [key: string]: any;
    }>;
    [key: string]: any;
  } | null;
}

export interface Conversation {
  id: string;
  user_id: number;
  title: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedMessagesResponse {
  messages: Message[];
  has_more: boolean;
  next_cursor: string | number | null;
}

export const chatService = {
  // Fetch active conversations
  getConversations: async (): Promise<Conversation[]> => {
    const response = await apiClient.get<Conversation[]>("/chat/conversations");
    return response.data;
  },

  // Fetch paginated message history for a specific conversation
  getMessages: async (
    conversationId: string,
    beforeId?: string | number | null
  ): Promise<PaginatedMessagesResponse> => {
    const response = await apiClient.get<PaginatedMessagesResponse>(
      `/chat/conversations/${conversationId}/messages`,
      {
        params: beforeId ? { before_id: beforeId } : {},
      }
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