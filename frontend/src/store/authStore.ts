import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthPayload, LoginFormValues, RegisterFormValues } from '@/types';
import { get as apiGet, post as apiPost } from '@/lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  register: (values: RegisterFormValues) => Promise<void>;
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      register: async (values) => {
        set({ isLoading: true, error: null });
        try {
          const payload = await apiPost<AuthPayload, RegisterFormValues>('/auth/register', values);
          set({ user: payload.user, isLoading: false });
        } catch (err: any) {
          set({ error: err?.error?.message ?? 'Eroare la creare cont', isLoading: false });
          throw err;
        }
      },

      login: async (values) => {
        set({ isLoading: true, error: null });
        try {
          const payload = await apiPost<AuthPayload, LoginFormValues>('/auth/login', values);
          set({ user: payload.user, isLoading: false });
        } catch (err: any) {
          set({ error: err?.error?.message ?? 'Eroare la login', isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await apiPost('/auth/logout');
        } finally {
          // stergem userul din state indiferent de raspunsul serverului
          set({ user: null, isLoading: false, error: null });
        }
      },

      fetchMe: async () => {
        set({ isLoading: true, error: null });
        try {
          const payload = await apiGet<AuthPayload>('/auth/me');
          set({ user: payload.user, isLoading: false });
        } catch {
          // probabil a expirat cookie-ul, curatam silentios
          set({ user: null, isLoading: false });
        }
      },

      updateUser: (user) => set({ user }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'rpg-auth',
      storage: createJSONStorage(() => sessionStorage),
      // salvam doar datele userului in session, nu si erorile de loading
      partialize: (state) => ({ user: state.user }),
    }
  )
);