import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { buildMariaDbAdapterConfig } from '../src/core/prisma/mariadb-adapter-options';
import { PrismaClient } from '../generated/prisma/client';

function readDatabaseConfigFromEnv(): {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
} {
  return {
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER ?? 'root',
    password: process.env.MYSQL_ROOT_PASSWORD ?? '',
    database: process.env.MYSQL_DATABASE ?? 'build_journal',
    connectionLimit: 5,
  };
}

export function createSeedPrismaClient(): PrismaClient {
  const adapter = new PrismaMariaDb(buildMariaDbAdapterConfig(readDatabaseConfigFromEnv()));
  return new PrismaClient({ adapter });
}
