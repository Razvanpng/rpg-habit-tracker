import type { Request, Response, NextFunction } from 'express';
import { getHabitsForUser, getHabitById, createHabit, updateHabit, deleteHabit, completeHabit, getHabitLogs } from './habits.service';
import type { CreateHabitInput, UpdateHabitInput } from './habits.schema';
import type { ApiSuccess, HabitDto, CompleteHabitResult } from '../../types/api.types';

export async function listHabits(req: Request, res: Response<ApiSuccess<HabitDto[]>>, next: NextFunction): Promise<void> {
  try {
    const habits = await getHabitsForUser(req.user!.sub);
    res.json({ success: true, data: habits });
  } catch (err) { next(err); }
}

export async function getHabit(req: Request<{ id: string }>, res: Response<ApiSuccess<HabitDto>>, next: NextFunction): Promise<void> {
  try {
    const habit = await getHabitById(req.params.id, req.user!.sub);
    res.json({ success: true, data: habit });
  } catch (err) { next(err); }
}

export async function create(req: Request<object, object, CreateHabitInput>, res: Response<ApiSuccess<HabitDto>>, next: NextFunction): Promise<void> {
  try {
    const habit = await createHabit(req.user!.sub, req.body);
    res.status(201).json({ success: true, data: habit });
  } catch (err) { next(err); }
}

export async function update(req: Request<{ id: string }, object, UpdateHabitInput>, res: Response<ApiSuccess<HabitDto>>, next: NextFunction): Promise<void> {
  try {
    const habit = await updateHabit(req.params.id, req.user!.sub, req.body);
    res.json({ success: true, data: habit });
  } catch (err) { next(err); }
}

export async function remove(req: Request<{ id: string }>, res: Response<ApiSuccess<{ deleted: true }>>, next: NextFunction): Promise<void> {
  try {
    await deleteHabit(req.params.id, req.user!.sub);
    res.json({ success: true, data: { deleted: true } });
  } catch (err) { next(err); }
}

export async function complete(req: Request<{ id: string }>, res: Response<ApiSuccess<CompleteHabitResult>>, next: NextFunction): Promise<void> {
  try {
    const result = await completeHabit(req.params.id, req.user!.sub);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getLogs(req: Request<{ id: string }>, res: Response<ApiSuccess<{ completedAt: Date; xpAwarded: number }[]>>, next: NextFunction): Promise<void> {
  try {
    const logs = await getHabitLogs(req.params.id, req.user!.sub);
    res.json({ success: true, data: logs });
  } catch (err) { next(err); }
}