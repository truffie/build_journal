import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateJournalTitleDto {
  @ApiProperty({ example: 'Журнал работ — июнь 2026' })
  @IsString()
  @MinLength(1)
  title: string;
}
