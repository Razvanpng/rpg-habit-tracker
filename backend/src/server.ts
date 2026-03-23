import { createApp } from './app';
import { prisma } from './config/database';
import { env } from './config/env';

async function main(): Promise<void> {
  await prisma.$connect();
  console.log('Database connection established');

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n${signal} received — shutting down gracefully...`);

    const forceExit = setTimeout(() => {
      console.error('!Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);

    try {
      server.close(() => {
        console.log('HTTP server closed');
      });

      await prisma.$disconnect();
      console.log('Database connection closed');

      clearTimeout(forceExit);
      process.exit(0);
    } catch (err) {
      console.error('Error during graceful shutdown:', err);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Promise Rejection:', reason);
    void shutdown('unhandledRejection');
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    void shutdown('uncaughtException');
  });
}

main().catch((err: unknown) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});