import type { Request, Response, NextFunction } from 'express';
import { type ZodSchema, type z } from 'zod';

// Overwrite req.body with the Zod-parsed, fully-typed result
export function validate<T extends ZodSchema>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(result.error);
      return;
    }
    req.body = result.data as z.infer<T>;
    next();
  };
}