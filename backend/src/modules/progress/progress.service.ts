import { prisma } from '../../config/database';
import type { ProgressSnapshot, SafeUser } from '../../types/api.types';

// Formula XP: N * 100 * 1.5^(N-1)
export function xpRequiredForLevel(level: number): number {
  return Math.floor(level * 100 * Math.pow(1.5, level - 1));
}

export function buildProgressSnapshot(level: number, currentXp: number): ProgressSnapshot {
  const xpToNextLevel = xpRequiredForLevel(level);
  const progressPercent = Math.min(Math.floor((currentXp / xpToNextLevel) * 100), 100);
  return { level, currentXp, xpToNextLevel, progressPercent };
}

export async function awardXp(
  userId: string,
  xpAmount: number,
  tx: Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  statUpdate: any = {} 
): Promise<{ leveledUp: boolean; updatedUser: SafeUser }> {
  const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });

  // Cap level at 50 immediately. Do not grant XP, just apply the stat update.
  if (user.level >= 50) {
    const updated = await tx.user.update({
      where: { id: userId },
      data: { ...statUpdate },
    });
    return { leveledUp: false, updatedUser: formatSafeUser(updated) };
  }

  let { level, currentXp } = user;
  currentXp += xpAmount;
  let leveledUp = false;

  let threshold = xpRequiredForLevel(level);
  
  // Level up logic respects the level 50 cap
  while (currentXp >= threshold && level < 50) {
    currentXp -= threshold;
    level += 1;
    leveledUp = true;
    threshold = xpRequiredForLevel(level);
  }

  // Final check to enforce strict 50 cap
  if (level >= 50) {
    level = 50;
    currentXp = 0; 
  }

  const updated = await tx.user.update({
    where: { id: userId },
    data: { 
      level, 
      currentXp,
      ...statUpdate 
    },
  });

  return { leveledUp, updatedUser: formatSafeUser(updated) };
}

export function formatSafeUser(user: {
  id: string;
  email: string;
  level: number;
  currentXp: number;
  strength: number;
  agility: number;
  intellect: number;
  createdAt: Date;
}): SafeUser {
  return {
    id: user.id,
    email: user.email,
    level: user.level,
    currentXp: user.currentXp,
    xpToNextLevel: xpRequiredForLevel(user.level),
    strength: user.strength,
    agility: user.agility,
    intellect: user.intellect,
    createdAt: user.createdAt,
  };
}

export async function getProgressForUser(userId: string): Promise<ProgressSnapshot> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  return buildProgressSnapshot(user.level, user.currentXp);
}