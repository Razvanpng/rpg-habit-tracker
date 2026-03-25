import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  type BodyType,
  type CharacterAppearance,
  type CharacterStats,
  CLASS_DEFINITIONS,
} from '@/types/character';

function calculateStats(level: number, bodyType: BodyType): CharacterStats {
  const base = 5 + Math.floor(level * 2.5);
  const weights = CLASS_DEFINITIONS[bodyType].statWeights;

  return {
    strength: Math.floor(base * weights.strength),
    agility: Math.floor(base * weights.agility),
    intellect: Math.floor(base * weights.intellect),
  };
}

interface CharacterState {
  appearance: CharacterAppearance;
  stats: CharacterStats;
  setBodyType: (bodyType: BodyType) => void;
  setSkinColor: (color: string) => void;
  setPrimaryColor: (color: string) => void;
  syncStatsWithLevel: (level: number) => void;
  setAppearance: (appearance: CharacterAppearance) => void;
}

const DEFAULT_APPEARANCE: CharacterAppearance = {
  bodyType: 'warrior',
  skinColor: '#f5c5a3',
  primaryColor: '#7c3aed',
};

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      appearance: DEFAULT_APPEARANCE,
      stats: calculateStats(1, DEFAULT_APPEARANCE.bodyType),

      setBodyType: (bodyType) => {
        set((state) => ({
          appearance: { ...state.appearance, bodyType },
          stats: calculateStats(1, bodyType),
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

      syncStatsWithLevel: (level) => {
        const { appearance } = get();
        set({ stats: calculateStats(level, appearance.bodyType) });
      },
    }),
    {
      name: 'rpg-character',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        appearance: state.appearance,
        stats: state.stats,
      }),
    }
  )
);