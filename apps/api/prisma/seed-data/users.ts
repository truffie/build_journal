import { UserRole } from '../../generated/prisma/client';

export type SeedUserDefinition = {
  readonly email: string;
  readonly fullName: string;
  readonly role: UserRole;
};

export const SEED_USERS: readonly SeedUserDefinition[] = [
  { email: 'admin@test.local', fullName: 'Администратор Системы', role: UserRole.ADMIN },
  { email: 'manager@test.local', fullName: 'Менеджер Проектов', role: UserRole.MANAGER },
  { email: 'foreman@test.local', fullName: 'Прораб Иванов', role: UserRole.FOREMAN },
];

export const SEED_DEFAULT_PASSWORD = 'password123';
