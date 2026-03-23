import rateLimit from 'express-rate-limit';
import type { ApiError } from '../types/api.types';

const rateLimitResponse = (message: string): ApiError => ({
  success: false,
  error: { message, code: 'RATE_LIMIT_EXCEEDED' },
});

// Strict limiter for auth routes — 10 attempts per 15 minutes per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse(
    'Too many login attempts, please try again in 15 minutes'
  ),
});

// General API limiter — 200 requests per minute per IP
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse('Too many requests, please slow down'),
});