/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from 'zustand';
import type { Habit, HabitFormValues, CompleteHabitResult, LevelUpEvent } from '@/types';
import { get as apiGet, post as apiPost, patch as apiPatch, del as apiDelete } from '@/lib/api';
import { useAuthStore } from './authStore';

interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  levelUpEvent: LevelUpEvent | null;
  fetchHabits: () => Promise<void>;
  createHabit: (values: HabitFormValues) => Promise<void>;
  updateHabit: (id: string, values: Partial<HabitFormValues>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  completeHabit: (id: string) => Promise<CompleteHabitResult>;
  clearLevelUp: () => void;
  clearError: () => void;
}

export const useHabitStore = create<HabitState>()((set, getStore) => ({
  habits: [],
  isLoading: false,
  error: null,
  levelUpEvent: null,

  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const habits = await apiGet<Habit[]>('/habits');
      set({ habits, isLoading: false });
    } catch (err: any) {
      set({ error: err?.error?.message ?? 'Eroare la incarcare habits', isLoading: false });
    }
  },

  createHabit: async (values) => {
    set({ isLoading: true, error: null });
    try {
      const habit = await apiPost<Habit, HabitFormValues>('/habits', values);
      set((state) => ({ habits: [...state.habits, habit], isLoading: false }));
    } catch (err: any) {
      set({ error: err?.error?.message ?? 'Eroare la creare habit', isLoading: false });
      throw err;
    }
  },

  updateHabit: async (id, values) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await apiPatch<Habit, Partial<HabitFormValues>>(`/habits/${id}`, values);
      set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? updated : h)),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err?.error?.message ?? 'Eroare la update', isLoading: false });
      throw err;
    }
  },

  deleteHabit: async (id) => {
    const previous = getStore().habits;
    
    set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
    
    try {
      await apiDelete(`/habits/${id}`);
    } catch (err: any) {
      set({ habits: previous, error: err?.error?.message ?? 'Nu s-a putut sterge' });
      throw err;
    }
  },

  completeHabit: async (id) => {
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, isCompletedToday: true } : h)),
    }));

    try {
      const result = await apiPost<CompleteHabitResult>(`/habits/${id}/complete`);
      
      set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? result.habit : h)),
      }));

      useAuthStore.getState().updateUser(result.user);

      if (result.leveledUp) {
        set({ levelUpEvent: { previousLevel: result.user.level - 1, newLevel: result.user.level } });
      }
      return result;
      
    } catch (err) {
      set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? { ...h, isCompletedToday: false } : h)),
      }));
      throw err;
    }
  },

  clearLevelUp: () => set({ levelUpEvent: null }),
  clearError: () => set({ error: null }),
}));