import { create } from 'zustand';

export interface UserState {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  points: number;
  city?: string;
  country?: string;
  language?: string;
}

interface AuthStore {
  user: UserState | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, user: UserState) => void;
  updateUserPoints: (points: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setTokens: (accessToken, user) => set({ accessToken, user, isAuthenticated: true }),
  updateUserPoints: (points) =>
    set((state) => ({
      user: state.user ? { ...state.user, points } : null,
    })),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
}));
