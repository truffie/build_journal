import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { AppConfigService } from '../config/app-config.service';
import { PrismaClient } from '../../../generated/prisma/client';
import { buildMariaDbAdapterConfig } from './mariadb-adapter-options';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(appConfig: AppConfigService) {
    const adapter = new PrismaMariaDb(buildMariaDbAdapterConfig(appConfig.getDatabaseConfig()));
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
