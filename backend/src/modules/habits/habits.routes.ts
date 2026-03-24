import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { createHabitSchema, updateHabitSchema } from './habits.schema';
import { listHabits, getHabit, create, update, remove, complete, getLogs } from './habits.controller';

export const habitsRouter = Router();

habitsRouter.use(authenticate);

habitsRouter.get('/', listHabits);
habitsRouter.get('/:id', getHabit);
habitsRouter.post('/', validate(createHabitSchema), create);
habitsRouter.patch('/:id', validate(updateHabitSchema), update);
habitsRouter.delete('/:id', remove);
habitsRouter.post('/:id/complete', complete);
habitsRouter.get('/:id/logs', getLogs);