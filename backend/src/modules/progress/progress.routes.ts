import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { getProgress } from './progress.controller';

export const progressRouter = Router();

progressRouter.use(authenticate);
progressRouter.get('/', getProgress);