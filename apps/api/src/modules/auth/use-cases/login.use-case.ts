import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { type LoginDto } from '../dto/login.dto';
import { type AuthUserResponse } from '../types/auth-tokens-response.type';
import { type IssuedTokens, IssueTokensUseCase } from './issue-tokens.use-case';

export type LoginResult = {
  readonly tokens: IssuedTokens;
  readonly user: AuthUserResponse;
};

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly issueTokensUseCase: IssueTokensUseCase,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Неверный email или пароль');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }
    const authUser: AuthUserResponse = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };
    const tokens = await this.issueTokensUseCase.execute(authUser);
    return { tokens, user: authUser };
  }
}
