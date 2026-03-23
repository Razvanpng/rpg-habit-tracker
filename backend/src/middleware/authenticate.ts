import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from './errorHandler';

export interface JwtPayload {
  sub: string;   // user.id
  email: string;
  iat: number;
  exp: number;
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const token: string | undefined = req.cookies?.token as string | undefined;

  if (!token) {
    next(UnauthorizedError('No session token provided'));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    // Pass JWT errors to the global error handler for safe mapping
    next(err);
  }
}