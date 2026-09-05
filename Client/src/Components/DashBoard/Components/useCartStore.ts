import { create } from "zustand";
import { Part } from "@/Types/types";

export interface CartItem {
  part: Part;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (part: Part, quantity?: number) => void;
  removeItem: (partCode: string) => void;
  updateQuantity: (partCode: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (part, quantity = 1) => {
    set((state) => {
  
      const existingItem = state.items.find(
        (item) => item.part.code === part.code
      );
      
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.part.code === part.code
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { items: [...state.items, { part, quantity }] };
    });
  },

  removeItem: (partCode) => {
    set((state) => ({
      items: state.items.filter((item) => item.part.code !== partCode),
    }));
  },

  updateQuantity: (partCode, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter((item) => item.part.code !== partCode),
        };
      }
      return {
        items: state.items.map((item) =>
          item.part.code === partCode ? { ...item, quantity } : item
        ),
      };
    });
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.part.price * item.quantity,
      0
    );
  },
}));