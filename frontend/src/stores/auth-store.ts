import { create } from "zustand";
import { AuthService } from "@/services";
import { MockUser } from "@/mocks";

interface AuthState {
  user: MockUser | null;
  isLoading: boolean;
  isChecking: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isChecking: true,

  login: async (username, password) => {
    set({ isLoading: true });
    try {
      const res = await AuthService.login(username, password);
      set({ user: res.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await AuthService.logout();
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isChecking: true });
    try {
      const user = await AuthService.checkSession();
      set({ user, isChecking: false });
    } catch {
      set({ user: null, isChecking: false });
    }
  },
}));
