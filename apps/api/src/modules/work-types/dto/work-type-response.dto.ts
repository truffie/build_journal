import { ApiProperty } from '@nestjs/swagger';

export class WorkTypeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Бетонные работы' })
  name: string;

  @ApiProperty({ example: 'м³' })
  defaultUnit: string;

  @ApiProperty({ example: 1 })
  sortOrder: number;
}
