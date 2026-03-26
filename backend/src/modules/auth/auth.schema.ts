import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Must be a valid email address').toLowerCase().trim(),
  password: z.string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must be at most 72 characters'),
});

export const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Must be a valid email address').toLowerCase().trim(),
  password: z.string({ required_error: 'Password is required' }).min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;