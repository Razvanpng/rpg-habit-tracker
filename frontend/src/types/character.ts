export type BodyType = 'warrior' | 'mage' | 'rogue';

export interface CharacterAppearance {
  bodyType: BodyType;
  skinColor: string;
  primaryColor: string;
}

export interface CharacterStats {
  strength: number;
  agility: number;
  intellect: number;
}

export interface Character {
  appearance: CharacterAppearance;
  stats: CharacterStats;
}

export interface ClassDefinition {
  id: BodyType;
  label: string;
  description: string;
  primaryStat: keyof CharacterStats;
  statWeights: {
    strength: number;
    agility: number;
    intellect: number;
  };
  gradient: string;
  glow: string;
}

export const CLASS_DEFINITIONS: Record<BodyType, ClassDefinition> = {
  warrior: {
    id: 'warrior',
    label: 'Warrior',
    description: 'Brute strength, unbreakable will.',
    primaryStat: 'strength',
    statWeights: { strength: 1.6, agility: 0.9, intellect: 0.5 },
    gradient: 'bg-warrior-gradient',
    glow: 'shadow-warrior',
  },
  mage: {
    id: 'mage',
    label: 'Mage',
    description: 'Arcane intellect, limitless potential.',
    primaryStat: 'intellect',
    statWeights: { strength: 0.5, agility: 0.9, intellect: 1.6 },
    gradient: 'bg-mage-gradient',
    glow: 'shadow-mage',
  },
  rogue: {
    id: 'rogue',
    label: 'Rogue',
    description: 'Swift strikes, shadow mastery.',
    primaryStat: 'agility',
    statWeights: { strength: 0.9, agility: 1.6, intellect: 0.5 },
    gradient: 'bg-rogue-gradient',
    glow: 'shadow-rogue',
  },
};

export const SKIN_COLORS = [
  { label: 'Pale', value: '#f5deb3' },
  { label: 'Fair', value: '#f5c5a3' },
  { label: 'Medium', value: '#d4956a' },
  { label: 'Tan', value: '#c68642' },
  { label: 'Brown', value: '#8d5524' },
  { label: 'Dark', value: '#4a2912' },
] as const;

export const PRIMARY_COLORS = [
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Crimson', value: '#dc2626' },
  { label: 'Azure', value: '#2563eb' },
  { label: 'Emerald', value: '#16a34a' },
  { label: 'Gold', value: '#ca8a04' },
  { label: 'Rose', value: '#db2777' },
] as const;