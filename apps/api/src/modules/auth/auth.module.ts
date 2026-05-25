import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfigService } from '../../core/config/app-config.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { IssueTokensUseCase } from './use-cases/issue-tokens.use-case';
import { LoginUseCase } from './use-cases/login.use-case';
import { RefreshTokensUseCase } from './use-cases/refresh-tokens.use-case';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (appConfig: AppConfigService) => ({
        secret: appConfig.getJwtSecret(),
        signOptions: {
          expiresIn: appConfig.getJwtAccessExpiresSeconds(),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    IssueTokensUseCase,
    LoginUseCase,
    RefreshTokensUseCase,
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
