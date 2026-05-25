import type { UserRole } from '../../../generated/prisma/client';

export type JwtPayload = {
  readonly sub: string;
  readonly email: string;
  readonly role: UserRole;
  readonly fullName: string;
};
