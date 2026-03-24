import { prisma } from '../../config/database';
import type { ProgressSnapshot, SafeUser } from '../../types/api.types';

// Formula XP: N * 100 * 1.5^(N-1)
// TODO: Frontend-ul trebuie sa tina formula asta in sync 
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
  tx: Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>
): Promise<{ leveledUp: boolean; updatedUser: SafeUser }> {
  const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });

  let { level, currentXp } = user;
  currentXp += xpAmount;
  let leveledUp = false;

  let threshold = xpRequiredForLevel(level);
  while (currentXp >= threshold) {
    currentXp -= threshold;
    level += 1;
    leveledUp = true;
    threshold = xpRequiredForLevel(level);
  }

  const updated = await tx.user.update({
    where: { id: userId },
    data: { level, currentXp },
  });

  return { leveledUp, updatedUser: formatSafeUser(updated) };
}

export function formatSafeUser(user: {
  id: string;
  email: string;
  level: number;
  currentXp: number;
  createdAt: Date;
}): SafeUser {
  return {
    id: user.id,
    email: user.email,
    level: user.level,
    currentXp: user.currentXp,
    xpToNextLevel: xpRequiredForLevel(user.level),
    createdAt: user.createdAt,
  };
}

export async function getProgressForUser(userId: string): Promise<ProgressSnapshot> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  return buildProgressSnapshot(user.level, user.currentXp);
}