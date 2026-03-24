import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/authenticate';
import { authLimiter } from '../../middleware/rateLimiter';
import { registerSchema, loginSchema } from './auth.schema';
import { register, login, logout, getMe } from './auth.controller';

export const authRouter = Router();

authRouter.post('/register', authLimiter, validate(registerSchema), register);
authRouter.post('/login', authLimiter, validate(loginSchema), login);
authRouter.post('/logout', authenticate, logout);
authRouter.get('/me', authenticate, getMe);