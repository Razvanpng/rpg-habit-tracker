import type { User, ProgressSnapshot } from '@/types';

export function xpRequiredForLevel(level: number): number {
  return Math.floor(level * 100 * Math.pow(1.5, level - 1));
}

export function getProgressSnapshot(user: User): ProgressSnapshot {
  const xpToNextLevel = xpRequiredForLevel(user.level);
  const progressPercent = Math.min(Math.floor((user.currentXp / xpToNextLevel) * 100), 100);
  return { level: user.level, currentXp: user.currentXp, xpToNextLevel, progressPercent };
}

export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = { 1: 'Initiate', 2: 'Apprentice', 3: 'Journeyman', 4: 'Adept', 5: 'Expert', 6: 'Veteran', 7: 'Master', 8: 'Grandmaster', 9: 'Legend', 10: 'Mythic' };
  if (level <= 0) return 'Initiate';
  if (level >= 10) return `Mythic ${Math.floor((level - 10) / 5) + 2}`;
  return titles[level] ?? 'Hero';
}

export function formatXp(xp: number): string { return `${xp.toLocaleString()} XP`; }