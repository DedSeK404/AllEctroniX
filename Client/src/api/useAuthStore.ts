// store/useAuthStore.ts
import { create } from "zustand";
import { useChatStore } from "@/api/useChatStore"; // 👈 Import useChatStore

export interface User {
  id: string | number;
  email: string;
  username?: string;
  is_active?: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  user: null,
  isAuthenticated: !!localStorage.getItem("token"),

  login: (token: string, user: User) => {
    localStorage.setItem("token", token);
    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),

  logout: () => {
    // 1. Wipe chat store & disconnect WebSockets 👈 ADD THIS LINE
    useChatStore.getState().reset();

    // 2. Clear token & auth state
    localStorage.removeItem("token");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));