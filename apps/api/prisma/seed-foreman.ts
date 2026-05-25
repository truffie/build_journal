import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../generated/prisma/client';
import { createSeedPrismaClient } from './create-prisma-client';

const BCRYPT_ROUNDS = 10;
const FOREMAN_EMAIL = 'foreman@test.local';
const FOREMAN_NAME = 'Прораб Иванов';
const DEFAULT_PASSWORD = 'password123';

async function executeSeed(): Promise<void> {
  const prisma = createSeedPrismaClient();
  try {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
    await prisma.user.upsert({
      where: { email: FOREMAN_EMAIL },
      create: {
        email: FOREMAN_EMAIL,
        fullName: FOREMAN_NAME,
        role: UserRole.FOREMAN,
        passwordHash,
        isActive: true,
      },
      update: {
        fullName: FOREMAN_NAME,
        role: UserRole.FOREMAN,
        passwordHash,
        isActive: true,
      },
    });
    console.log(`Foreman user seeded: ${FOREMAN_EMAIL} / ${DEFAULT_PASSWORD}`);
  } finally {
    await prisma.$disconnect();
  }
}

void executeSeed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
