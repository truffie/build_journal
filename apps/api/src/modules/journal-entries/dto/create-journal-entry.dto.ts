import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateJournalEntryDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  workTypeId: number;

  @ApiProperty({ example: '2026-05-20', format: 'date' })
  @IsDateString()
  workDate: string;

  @ApiProperty({ example: 24.5 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  volume: number;

  @ApiProperty({ example: 'Иванов И.И.' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  workerName: string;

  @ApiPropertyOptional({ example: 'м²' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  unitOverride?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @ApiPropertyOptional({ example: 'Секция А' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  locationSection?: string;

  @ApiPropertyOptional({ example: '3' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  locationFloor?: string;

  @ApiPropertyOptional({ example: '1-3 / А-В' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  locationAxes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conditionsText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
