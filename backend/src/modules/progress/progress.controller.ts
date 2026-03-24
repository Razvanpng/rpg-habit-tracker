import type { Request, Response, NextFunction } from 'express';
import { getProgressForUser } from './progress.service';
import type { ApiSuccess, ProgressSnapshot } from '../../types/api.types';

export async function getProgress(req: Request, res: Response<ApiSuccess<ProgressSnapshot>>, next: NextFunction): Promise<void> {
  try {
    const snapshot = await getProgressForUser(req.user!.sub);
    res.json({ success: true, data: snapshot });
  } catch (err) { next(err); }
}