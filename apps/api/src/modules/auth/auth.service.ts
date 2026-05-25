import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { type LoginDto } from './dto/login.dto';
import { type AuthUserResponse } from './types/auth-tokens-response.type';
import { LoginUseCase, type LoginResult } from './use-cases/login.use-case';
import { RefreshTokensUseCase } from './use-cases/refresh-tokens.use-case';
import { type IssuedTokens } from './use-cases/issue-tokens.use-case';

export type AuthResult = {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: AuthUserResponse;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokensUseCase: RefreshTokensUseCase,
    private readonly prisma: PrismaService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResult> {
    const result: LoginResult = await this.loginUseCase.execute(dto);
    return {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      user: result.user,
    };
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    const tokens: IssuedTokens = await this.refreshTokensUseCase.execute(refreshToken);
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: this.extractSub(tokens.accessToken) },
      select: { id: true, email: true, role: true, fullName: true },
    });
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    };
  }

  private extractSub(accessToken: string): string {
    const payload = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString(),
    ) as { sub: string };
    return payload.sub;
  }
}
