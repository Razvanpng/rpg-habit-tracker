import type { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getCurrentUser, createTokenForUser, cookieConfig, clearCookieConfig } from './auth.service';
import type { RegisterInput, LoginInput } from './auth.schema';
import type { ApiSuccess, AuthPayload } from '../../types/api.types';

export async function register(req: Request<object, object, RegisterInput>, res: Response<ApiSuccess<AuthPayload>>, next: NextFunction): Promise<void> {
  try {
    const payload = await registerUser(req.body);
    const token = createTokenForUser(payload.user.id, payload.user.email);
    res.cookie('token', token, cookieConfig);
    res.status(201).json({ success: true, data: payload });
  } catch (err) { next(err); }
}

export async function login(req: Request<object, object, LoginInput>, res: Response<ApiSuccess<AuthPayload>>, next: NextFunction): Promise<void> {
  try {
    const payload = await loginUser(req.body);
    const token = createTokenForUser(payload.user.id, payload.user.email);
    res.cookie('token', token, cookieConfig);
    res.json({ success: true, data: payload });
  } catch (err) { next(err); }
}

export function logout(_req: Request, res: Response, _next: NextFunction): void {
  res.clearCookie('token', clearCookieConfig);
  res.json({ success: true, data: { authenticated: false } });
}

export async function getMe(req: Request, res: Response<ApiSuccess<AuthPayload>>, next: NextFunction): Promise<void> {
  try {
    const payload = await getCurrentUser(req.user!.sub);
    res.json({ success: true, data: payload });
  } catch (err) { next(err); }
}