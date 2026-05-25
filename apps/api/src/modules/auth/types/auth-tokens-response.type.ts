import type { UserRole } from '../../../../generated/prisma/client';

export type AuthUserResponse = {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole;
  readonly fullName: string;
};
