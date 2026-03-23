import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import type { ApiError } from '../types/api.types';

// A typed application error that services/controllers can throw deliberately
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Named constructors for common cases — keeps controller code clean
export const NotFoundError = (resource: string): AppError =>
  new AppError(`${resource} not found`, 404, 'NOT_FOUND');

export const UnauthorizedError = (message = 'Unauthorized'): AppError =>
  new AppError(message, 401, 'UNAUTHORIZED');

export const ForbiddenError = (message = 'Forbidden'): AppError =>
  new AppError(message, 403, 'FORBIDDEN');

export const ConflictError = (message: string): AppError =>
  new AppError(message, 409, 'CONFLICT');

export const BadRequestError = (message: string): AppError =>
  new AppError(message, 400, 'BAD_REQUEST');

// ─── Global handler ───────────────────────────────────────────────────────────

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // 1. Operational errors thrown deliberately by the app
  if (err instanceof AppError) {
    const body: ApiError = {
      success: false,
      error: { message: err.message, code: err.code },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  // 2. Zod validation errors (from the `validate` middleware)
  if (err instanceof ZodError) {
    const fields: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const key = issue.path.join('.');
      if (!fields[key]) fields[key] = [];
      fields[key].push(issue.message);
    }
    const body: ApiError = {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        fields,
      },
    };
    res.status(422).json(body);
    return;
  }

  // 3. JWT errors — do not leak token details
  if (err instanceof TokenExpiredError) {
    const body: ApiError = {
      success: false,
      error: { message: 'Session expired, please log in again', code: 'TOKEN_EXPIRED' },
    };
    res.status(401).json(body);
    return;
  }

  if (err instanceof JsonWebTokenError) {
    const body: ApiError = {
      success: false,
      error: { message: 'Invalid session token', code: 'TOKEN_INVALID' },
    };
    res.status(401).json(body);
    return;
  }

  // 4. Prisma known request errors — map to safe messages
  if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as { code: unknown }).code === 'string'
  ) {
    const prismaErr = err as { code: string };
    if (prismaErr.code === 'P2002') {
      const body: ApiError = {
        success: false,
        error: { message: 'A record with that value already exists', code: 'DUPLICATE_ENTRY' },
      };
      res.status(409).json(body);
      return;
    }
    if (prismaErr.code === 'P2025') {
      const body: ApiError = {
        success: false,
        error: { message: 'Record not found', code: 'NOT_FOUND' },
      };
      res.status(404).json(body);
      return;
    }
  }

  // 5. Truly unexpected errors — log server-side, return generic message
  console.error('[Unhandled Error]', err);
  const body: ApiError = {
    success: false,
    error: {
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
    },
  };
  res.status(500).json(body);
}