import { create } from "zustand";
import apiClient from "./Client";
import { Part } from "@/Types/types";

export interface CartItem {
  id: number;
  part: Part;
  part_code: string;
  quantity: number;
}

export interface CartResponse {
  id: number;
  user_id: number;
  items: CartItem[];
}

export interface CartHistoryRecord {
  id: number;
  cart_id: number;
  user_id: number;
  creation_date: string;
}

interface CartState {
  items: CartItem[];
  orderHistory: CartHistoryRecord[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (partCode: string, quantity?: number) => Promise<void>;
  updateQuantity: (partCode: string, quantity: number) => Promise<void>;
  removeItem: (partCode: string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // History & Checkout Actions
  checkoutCart: () => Promise<CartHistoryRecord | null>;
  fetchOrderHistory: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  orderHistory: [],
  isLoading: false,
  error: null,

  // Fetch initial cart from FastAPI backend (/api/cart/)
  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<CartResponse>("/cart/");
      set({ items: response.data.items, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.detail || "Failed to fetch cart",
        isLoading: false,
      });
    }
  },

  // Add item to cart via POST /api/cart/items/
  addItem: async (partCode: string, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<CartResponse>("/cart/items/", {
        part_code: partCode,
        quantity,
      });
      set({ items: response.data.items, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.detail || "Failed to add item",
        isLoading: false,
      });
    }
  },

  // Update quantity via PATCH /api/cart/items/
  updateQuantity: async (partCode: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch<CartResponse>("/cart/items/", {
        part_code: partCode,
        quantity,
      });
      set({ items: response.data.items, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.detail || "Failed to update item quantity",
        isLoading: false,
      });
    }
  },

  // Remove single item via DELETE /api/cart/items/{part_code}
  removeItem: async (partCode: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.delete<CartResponse>(
        `/cart/items/${partCode}`
      );
      set({ items: response.data.items, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.detail || "Failed to remove item",
        isLoading: false,
      });
    }
  },

  // Clear all items via DELETE /api/cart/
  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.delete<CartResponse>("/cart/");
      set({ items: response.data.items, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.detail || "Failed to clear cart",
        isLoading: false,
      });
    }
  },

  // Checkout active cart via POST /api/cart/checkout
  checkoutCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<CartHistoryRecord>("/cart/checkout");
      // Clear local active cart items & append new record to history state
      set((state) => ({
        items: [],
        orderHistory: [response.data, ...state.orderHistory],
        isLoading: false,
      }));
      return response.data;
    } catch (err: any) {
      set({
        error: err.response?.data?.detail || "Failed to confirm order",
        isLoading: false,
      });
      return null;
    }
  },

  // Fetch past orders via GET /api/cart/history
  fetchOrderHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<CartHistoryRecord[]>("/cart/history");
      set({ orderHistory: response.data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.detail || "Failed to fetch order history",
        isLoading: false,
      });
    }
  },
}));