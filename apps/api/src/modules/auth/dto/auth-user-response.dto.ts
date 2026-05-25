import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../generated/prisma/client';

export class AuthUserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'foreman@test.local' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.FOREMAN })
  role: UserRole;

  @ApiProperty({ example: 'Прораб Иванов' })
  fullName: string;
}
