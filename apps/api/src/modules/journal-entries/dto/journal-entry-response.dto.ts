import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JournalEntryResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  journalId: string;

  @ApiProperty({ type: String, format: 'date' })
  workDate: Date;

  @ApiProperty()
  workTypeSnapshot: string;

  @ApiProperty()
  unitSnapshot: string;

  @ApiProperty({ example: '24.00' })
  volume: string;

  @ApiProperty()
  workerNameSnapshot: string;

  @ApiProperty()
  orderIndex: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  locationSection: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  locationFloor: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  locationAxes: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  conditionsText: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  notes: string | null;
}
