import express, { type Application, type Request, type Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { authRouter } from './modules/auth/auth.routes';

// Module routers — imported here, registered below
// (Filled in during the next phases as modules are built)
// import { authRouter } from './modules/auth/auth.routes';
// import { habitsRouter } from './modules/habits/habits.routes';
// import { progressRouter } from './modules/progress/progress.routes';

export function createApp(): Application {
  const app = express();

  //Security headers
  app.use(
    helmet({
      // Allows the frontend to read cookies cross-origin in development
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  //CORS
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) {
          callback(null, true);
          return;
        }
        if (env.ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin ${origin} not permitted`));
        }
      },
      credentials: true,          // Required for HttpOnly cookie exchange
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept'],
    })
  );

  //Body parsing
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser(env.COOKIE_SECRET));

  //Rate limiting
  app.use('/api', apiLimiter);

  //Health check (no auth, no rate limit) 
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  //API routes 
  app.use('/api/auth', authRouter);
  // app.use('/api/habits', habitsRouter);
  // app.use('/api/progress', progressRouter);

  //404 handler 
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: { message: 'Route not found', code: 'NOT_FOUND' },
    });
  });

  //Global error boundary
  app.use(errorHandler);

  return app;
}