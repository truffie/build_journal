import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../../../core/config/app-config.service';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { type AuthUserResponse } from '../types/auth-tokens-response.type';
import { type IssuedTokens, IssueTokensUseCase } from './issue-tokens.use-case';

@Injectable()
export class RefreshTokensUseCase {
  private readonly refreshSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    appConfig: AppConfigService,
    private readonly prisma: PrismaService,
    private readonly issueTokensUseCase: IssueTokensUseCase,
  ) {
    this.refreshSecret = appConfig.getJwtRefreshSecret();
  }

  async execute(refreshToken: string): Promise<IssuedTokens> {
    const payload = this.verifyRefreshToken(refreshToken);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, fullName: true, isActive: true },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Пользователь не найден или деактивирован');
    }
    const authUser: AuthUserResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };
    return this.issueTokensUseCase.execute(authUser);
  }

  private verifyRefreshToken(token: string): { sub: string } {
    try {
      return this.jwtService.verify<{ sub: string }>(token, { secret: this.refreshSecret });
    } catch {
      throw new UnauthorizedException('Сессия истекла, войдите заново');
    }
  }
}
