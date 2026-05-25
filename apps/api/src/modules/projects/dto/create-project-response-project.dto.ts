import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectResponseProjectDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;
}
