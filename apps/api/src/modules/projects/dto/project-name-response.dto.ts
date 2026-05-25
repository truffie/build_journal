import { ApiProperty } from '@nestjs/swagger';

export class ProjectNameResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'ЖК «Южный», корпус 2' })
  name: string;
}
