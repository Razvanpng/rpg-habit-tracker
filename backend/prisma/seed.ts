import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Seeding database...');
  const passwordHash = await bcrypt.hash('Password123!', 12);

  const user = await prisma.user.upsert({
    where: { email: 'hero@rpghabits.dev' },
    update: {},
    create: {
      email: 'hero@rpghabits.dev',
      passwordHash,
      level: 3,
      currentXp: 120,
      habits: {
        create: [
          { name: 'Morning meditation', description: '10 minutes of focused breathing', xpReward: 50 },
          { name: 'Read 30 pages', description: 'Any non-fiction book', xpReward: 75 },
          { name: 'Workout', description: 'At least 45 minutes of exercise', xpReward: 100 },
        ],
      },
    },
  });

  console.log(`Seeded user: ${user.email} (id: ${user.id})`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());