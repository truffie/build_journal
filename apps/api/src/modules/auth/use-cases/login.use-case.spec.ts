import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginUseCase } from './login.use-case';

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'FOREMAN' as const,
  fullName: 'Test User',
  isActive: true,
  passwordHash: '',
};

const mockPrisma = {
  user: { findUnique: jest.fn() },
};

const mockIssueTokens = {
  execute: jest.fn().mockResolvedValue({
    accessToken: 'access-tok',
    refreshToken: 'refresh-tok',
  }),
};

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  beforeEach(async () => {
    mockUser.passwordHash = await bcrypt.hash('validpass', 10);
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    useCase = new LoginUseCase(mockPrisma as any, mockIssueTokens as any);
  });

  it('returns tokens and user on valid credentials', async () => {
    const result = await useCase.execute({ email: 'Test@Example.com', password: 'validpass' });
    expect(result.tokens.accessToken).toBe('access-tok');
    expect(result.user.email).toBe('test@example.com');
  });

  it('throws on invalid email', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(useCase.execute({ email: 'bad@x.com', password: 'p' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws on wrong password', async () => {
    await expect(useCase.execute({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws on inactive user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, isActive: false });
    await expect(useCase.execute({ email: 'test@example.com', password: 'validpass' })).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
