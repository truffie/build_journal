import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectJournalDto {
  @ApiProperty({ example: 'Журнал работ — июнь 2026' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title: string;
}
