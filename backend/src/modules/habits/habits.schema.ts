import { z } from 'zod';

export const createHabitSchema = z.object({
  name: z.string({ required_error: 'Habit name is required' }).min(1, 'Habit name cannot be empty').max(100, 'Habit name must be at most 100 characters').trim(),
  description: z.string().max(300, 'Description must be at most 300 characters').trim().optional(),
  xpReward: z.number({invalid_type_error: 'XP reward must be a number'}).int('XP reward must be a whole number').min(10,  'XP reward must be at least 10').max(500, 'XP reward cannot exceed 500').default(50),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1, 'Habit name cannot be empty').max(100, 'Habit name must be at most 100 characters').trim().optional(),
  description: z.string().max(300, 'Description must be at most 300 characters').trim().nullable().optional(),
  xpReward: z.number().int('XP reward must be a whole number').min(10,  'XP reward must be at least 10').max(500, 'XP reward cannot exceed 500').optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided for update' });

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;