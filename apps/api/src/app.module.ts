import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppConfigModule } from './core/config/app-config.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { JournalEntriesModule } from './modules/journal-entries/journal-entries.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { WorkTypesModule } from './modules/work-types/work-types.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 60000, limit: 60 },
    ]),
    AppConfigModule,
    PrismaModule,
    AuthModule,
    ProjectsModule,
    JournalEntriesModule,
    WorkTypesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
