import { create } from "zustand";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  signup: (username: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // Called from SignIn.tsx after basic form validation
  login: (email: string) => {
    set({
      isAuthenticated: true,
      user: { 
        id: "usr_mock123", 
        username: email.split("@")[0], // Mock username from email
        email 
      },
    });
  },

  // Called from SignUp.tsx with username & email
  signup: (username: string, email: string) => {
    set({
      isAuthenticated: true,
      user: { 
        id: "usr_mock123", 
        username, 
        email 
      },
    });
  },

  // Clears active user session
  logout: () => set({ user: null, isAuthenticated: false }),
}));