import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'ЖК «Южный», корпус 2' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Журнал работ — май 2026' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  journalTitle: string;
}
