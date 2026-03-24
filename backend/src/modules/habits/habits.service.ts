import { prisma } from '../../config/database';
import { NotFoundError, BadRequestError } from '../../middleware/errorHandler';
import { awardXp } from '../progress/progress.service';
import type { CreateHabitInput, UpdateHabitInput } from './habits.schema';
import type { HabitDto, CompleteHabitResult } from '../../types/api.types';

function toHabitDto(habit: any): HabitDto {
  return { 
    id: habit.id, 
    userId: habit.userId, 
    name: habit.name, 
    description: habit.description, 
    xpReward: habit.xpReward, 
    isCompletedToday: habit.isCompletedToday, 
    createdAt: habit.createdAt, 
    updatedAt: habit.updatedAt 
  };
}

function toUtcDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Lazy reset pt habit-uri (mai ieftin decat un cron job)
async function runDailyResetIfNeeded(userId: string): Promise<boolean> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  
  const lastActive = toUtcDateString(user.lastActiveDate);
  const today = toUtcDateString(new Date());

  if (lastActive === today) return false;

  // resetam tot in tranzactie ca sa fim safe
  await prisma.$transaction([
    prisma.habit.updateMany({ where: { userId }, data: { isCompletedToday: false } }),
    prisma.user.update({ where: { id: userId }, data: { lastActiveDate: new Date() } }),
  ]);
  
  return true;
}

export async function getHabitsForUser(userId: string): Promise<HabitDto[]> {
  await runDailyResetIfNeeded(userId);
  const habits = await prisma.habit.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
  return habits.map(toHabitDto);
}

export async function getHabitById(habitId: string, userId: string): Promise<HabitDto> {
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) throw NotFoundError('Habit');
  return toHabitDto(habit);
}

export async function createHabit(userId: string, input: CreateHabitInput): Promise<HabitDto> {
  const count = await prisma.habit.count({ where: { userId } });
  // TODO: de marit limita asta daca ne cer userii
  if (count >= 50) throw BadRequestError('You cannot have more than 50 habits');

  const habit = await prisma.habit.create({
    data: { userId, name: input.name, description: input.description ?? null, xpReward: input.xpReward },
  });
  return toHabitDto(habit);
}

export async function updateHabit(habitId: string, userId: string, input: UpdateHabitInput): Promise<HabitDto> {
  const existing = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!existing) throw NotFoundError('Habit');

  const updated = await prisma.habit.update({
    where: { id: habitId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.xpReward !== undefined && { xpReward: input.xpReward }),
    },
  });
  return toHabitDto(updated);
}

export async function deleteHabit(habitId: string, userId: string): Promise<void> {
  const existing = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!existing) throw NotFoundError('Habit');
  await prisma.habit.delete({ where: { id: habitId } });
}

export async function completeHabit(habitId: string, userId: string): Promise<CompleteHabitResult> {
  await runDailyResetIfNeeded(userId);

  return await prisma.$transaction(async (tx) => {
    const habit = await tx.habit.findFirst({ where: { id: habitId, userId } });
    if (!habit) throw NotFoundError('Habit');
    
    if (habit.isCompletedToday) {
      throw BadRequestError('This habit has already been completed today');
    }

    const updatedHabit = await tx.habit.update({
      where: { id: habitId },
      data: { isCompletedToday: true },
    });

    // log-ul e imuabil, pastram valoarea de xp din momentul completarii
    await tx.habitLog.create({
      data: { habitId, userId, xpAwarded: habit.xpReward },
    });

    const { leveledUp, updatedUser } = await awardXp(userId, habit.xpReward, tx);

    return {
      habit: toHabitDto(updatedHabit),
      xpAwarded: habit.xpReward,
      leveledUp,
      user: updatedUser,
    };
  });
}

export async function getHabitLogs(habitId: string, userId: string): Promise<{ completedAt: Date; xpAwarded: number }[]> {
  const habit = await prisma.habit.findFirst({ where: { id: habitId, userId } });
  if (!habit) throw NotFoundError('Habit');

  return await prisma.habitLog.findMany({
    where: { habitId, userId },
    orderBy: { completedAt: 'desc' },
    take: 30, // luam doar ultimele 30 de zile pt chart-uri
    select: { completedAt: true, xpAwarded: true },
  });
}