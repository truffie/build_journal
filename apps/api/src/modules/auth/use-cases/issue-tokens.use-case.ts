import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../../../core/config/app-config.service';
import { type JwtPayload } from '../../../shared/types/jwt-payload.type';
import { type AuthUserResponse } from '../types/auth-tokens-response.type';

export type IssuedTokens = {
  readonly accessToken: string;
  readonly refreshToken: string;
};

@Injectable()
export class IssueTokensUseCase {
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: string;

  constructor(
    private readonly jwtService: JwtService,
    appConfig: AppConfigService,
  ) {
    this.refreshSecret = appConfig.getJwtRefreshSecret();
    this.refreshExpiresIn = appConfig.getJwtRefreshExpiresIn();
  }

  async execute(user: AuthUserResponse): Promise<IssuedTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(
        { sub: user.id },
        { secret: this.refreshSecret, expiresIn: this.refreshExpiresIn as `${number}d` },
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
