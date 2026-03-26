import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';
import { get, post } from '@/lib/api';
import type { AuthPayload, LoginFormValues, RegisterFormValues } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
  register: (values: RegisterFormValues) => Promise<void>;
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
  _setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, getStore) => ({
      user: null,
      isLoading: false,
      isHydrated: false,
      error: null,
      _setHydrated: () => set({ isHydrated: true }),

      register: async (values) => {
        set({ isLoading: true, error: null });
        try {
          const payload = await post<AuthPayload, RegisterFormValues>('/auth/register', values);
          set({ user: payload.user, isLoading: false });
        } catch (err) {
          const message = (err as any)?.error?.message ?? 'Registration failed';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      login: async (values) => {
        set({ isLoading: true, error: null });
        try {
          const payload = await post<AuthPayload, LoginFormValues>('/auth/login', values);
          set({ user: payload.user, isLoading: false });
        } catch (err) {
          const message = (err as any)?.error?.message ?? 'Login failed';
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await post('/auth/logout');
        } finally {
          set({ user: null, isLoading: false, error: null });
          localStorage.removeItem('rpg-auth');
        }
      },

      fetchMe: async () => {
        try {
          const payload = await get<AuthPayload>('/auth/me');
          set({ user: payload.user });
        } catch {
          set({ user: null });
        }
      },

      updateUser: (user) => set({ user }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'rpg-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated();
        state?.fetchMe();
      },
    }
  )
);