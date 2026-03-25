import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  type BodyType,
  type CharacterAppearance,
} from '@/types/character';

interface CharacterState {
  appearance: CharacterAppearance;
  setBodyType: (bodyType: BodyType) => void;
  setSkinColor: (color: string) => void;
  setPrimaryColor: (color: string) => void;
  setAppearance: (appearance: CharacterAppearance) => void;
}

const DEFAULT_APPEARANCE: CharacterAppearance = {
  bodyType: 'warrior',
  skinColor: '#f5c5a3',
  primaryColor: '#7c3aed',
};

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
      appearance: DEFAULT_APPEARANCE,

      setBodyType: (bodyType) => {
        set((state) => ({
          appearance: { ...state.appearance, bodyType },
        }));
      },

      setSkinColor: (skinColor) => {
        set((state) => ({
          appearance: { ...state.appearance, skinColor },
        }));
      },

      setPrimaryColor: (primaryColor) => {
        set((state) => ({
          appearance: { ...state.appearance, primaryColor },
        }));
      },

      setAppearance: (appearance) => {
        set({ appearance });
      },
    }),
    {
      name: 'rpg-character',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        appearance: state.appearance,
      }),
    }
  )
);