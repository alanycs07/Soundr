import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  tier: 'basic' | 'pro';
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  login: (email: string) => {
    set({
      user: {
        id: '1',
        email,
        name: email.split('@')[0],
        tier: 'basic',
      },
    });
  },
  logout: () => {
    set({ user: null });
  },
}));