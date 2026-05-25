import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateJournalEntryDto {
  @ApiPropertyOptional({ format: 'date', example: '2026-05-25' })
  @IsOptional()
  @IsDateString()
  workDate?: string;

  @ApiPropertyOptional({ example: 'Кладка перегородок' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  workTypeSnapshot?: string;

  @ApiPropertyOptional({ example: 'м²' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  unitSnapshot?: string;

  @ApiPropertyOptional({ example: 45.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  volume?: number;

  @ApiPropertyOptional({ example: 'Петров С.В.' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  workerNameSnapshot?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @ApiPropertyOptional({ example: 'Секция Б' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  locationSection?: string;

  @ApiPropertyOptional({ example: '5' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  locationFloor?: string;

  @ApiPropertyOptional({ example: '4-6 / Г-Д' })
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
