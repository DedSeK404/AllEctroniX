import { create } from "zustand";

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
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  user: null,
  isAuthenticated: !!localStorage.getItem("token"),

  // Called after successful authentication & fetching /api/auth/me
  login: (token: string, user: User) => {
    localStorage.setItem("token", token);
    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  // Clears active session and token from localStorage
  logout: () => {
    localStorage.removeItem("token");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));