import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type DatabaseConfig } from './database-config.type';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  isProduction(): boolean {
    return this.getNodeEnv() === 'production';
  }

  isDevelopment(): boolean {
    return !this.isProduction();
  }

  isSwaggerEnabled(): boolean {
    return this.isDevelopment();
  }

  getPort(): number {
    return this.getRequiredNumber('PORT', 3000);
  }

  getCorsOrigin(): string {
    return this.getRequiredString('CORS_ORIGIN');
  }

  getJournalMode(): string {
    return this.configService.get<string>('JOURNAL_MODE', 'construction');
  }

  getInstanceName(): string {
    return this.configService.get<string>('INSTANCE_NAME', 'Build Journal');
  }

  getJwtSecret(): string {
    return this.getRequiredString('JWT_SECRET');
  }

  getJwtRefreshSecret(): string {
    return this.getRequiredString('JWT_REFRESH_SECRET');
  }

  getJwtAccessExpiresSeconds(): number {
    return this.getRequiredNumber('JWT_ACCESS_EXPIRES_SECONDS', 900);
  }

  getJwtRefreshExpiresIn(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
  }

  getDatabaseConfig(): DatabaseConfig {
    return {
      host: this.getRequiredString('MYSQL_HOST'),
      port: this.getRequiredNumber('MYSQL_PORT'),
      user: this.getRequiredString('MYSQL_USER'),
      password: this.getRequiredString('MYSQL_ROOT_PASSWORD'),
      database: this.getRequiredString('MYSQL_DATABASE'),
      connectionLimit: 10,
    };
  }

  private getRequiredString(key: string): string {
    return this.configService.getOrThrow<string>(key);
  }

  private getRequiredNumber(key: string, fallback?: number): number {
    const raw = this.configService.get<string>(key);
    if (raw === undefined || raw === null || String(raw).trim() === '') {
      if (fallback !== undefined) {
        return fallback;
      }
      throw new Error(`Configuration error: "${key}" is not defined`);
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      throw new Error(`Configuration error: "${key}" must be a number`);
    }
    return parsed;
  }
}
