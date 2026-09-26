import { create } from 'zustand';
import apiClient from './Client';

// Interfaces matching your Pydantic/FastAPI schemas
export interface CartItem {
  id: number;
  part_code: string;
  quantity: number;
}

export interface CartResponse {
  id: number;
  user_id: number;
  items: CartItem[];
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (partCode: string, quantity?: number) => Promise<void>;
  updateQuantity: (partCode: string, quantity: number) => Promise<void>;
  removeItem: (partCode: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useBackendCartStore = create<CartState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  // Fetch initial cart from FastAPI backend (/api/cart/)
  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<CartResponse>('/api/cart/');
      set({ items: response.data.items, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.detail || 'Failed to fetch cart',
        isLoading: false,
      });
    }
  },

  // Add item to cart via POST /api/cart/items/
  addItem: async (partCode: string, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<CartResponse>('/api/cart/items/', {
        part_code: partCode,
        quantity,
      });
      console.log('AddItem Response:', response);
      set({ items: response.data.items, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.detail || 'Failed to add item',
        isLoading: false,
      });
    }
  },

  // Update quantity via PATCH /api/cart/items/
  updateQuantity: async (partCode: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch<CartResponse>('/api/cart/items/', {
        part_code: partCode,
        quantity,
      });
      set({ items: response.data.items, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.detail || 'Failed to update item quantity',
        isLoading: false,
      });
    }
  },

  // Remove single item via DELETE /api/cart/items/{part_code}
  removeItem: async (partCode: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.delete<CartResponse>(`/api/cart/items/${partCode}`);
      set({ items: response.data.items, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.detail || 'Failed to remove item',
        isLoading: false,
      });
    }
  },

  // Clear all items via DELETE /api/cart/
  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.delete<CartResponse>('/api/cart/');
      set({ items: response.data.items, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.detail || 'Failed to clear cart',
        isLoading: false,
      });
    }
  },
}));