import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from './errorHandler';

export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  // citim direct din cookie
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    next(UnauthorizedError('Nu esti logat'));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    next(err); // errorHandler-ul global se ocupa de TokenExpired etc.
  }
}