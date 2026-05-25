import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import type { PrismaClient } from '../generated/prisma/client';
import { createSeedPrismaClient } from './create-prisma-client';
import { WORK_TYPES } from './seed-data/data';
import { seedDemoProjectEntries } from './seed-data/demo-project';
import { SEED_DEFAULT_PASSWORD, SEED_USERS } from './seed-data/users';

const BCRYPT_ROUNDS = 10;

async function seedUsers(prisma: PrismaClient): Promise<void> {
  const passwordHash = await bcrypt.hash(SEED_DEFAULT_PASSWORD, BCRYPT_ROUNDS);
  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      create: {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        passwordHash,
        isActive: true,
      },
      update: {
        fullName: user.fullName,
        role: user.role,
        passwordHash,
        isActive: true,
      },
    });
  }
}

async function seedWorkTypes(prisma: PrismaClient): Promise<void> {
  for (const workType of WORK_TYPES) {
    await prisma.workType.upsert({
      where: { name: workType.name },
      create: {
        name: workType.name,
        defaultUnit: workType.defaultUnit,
        sortOrder: workType.sortOrder,
        isActive: true,
      },
      update: {
        defaultUnit: workType.defaultUnit,
        sortOrder: workType.sortOrder,
        isActive: true,
      },
    });
  }
}

async function executeSeed(): Promise<void> {
  const prisma = createSeedPrismaClient();
  try {
    console.log('Seeding users...');
    await seedUsers(prisma);
    console.log('Seeding work types catalog...');
    await seedWorkTypes(prisma);
    const foreman = await prisma.user.findUnique({
      where: { email: 'foreman@test.local' },
      select: { id: true },
    });
    if (foreman) {
      console.log('Seeding demo project and journal entries...');
      await seedDemoProjectEntries(prisma, foreman.id);
    }
    console.log('Seed completed.');
    console.log(`Default password: ${SEED_DEFAULT_PASSWORD}`);
    console.log('Users: admin@test.local, manager@test.local, foreman@test.local');
  } finally {
    await prisma.$disconnect();
  }
}

void executeSeed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
