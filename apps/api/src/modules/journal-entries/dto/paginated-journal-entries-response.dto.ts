import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JournalEntryResponseDto } from './journal-entry-response.dto';

export class PaginatedJournalEntriesResponseDto {
  @ApiProperty({ type: [JournalEntryResponseDto] })
  items: JournalEntryResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiPropertyOptional({ format: 'date', example: '2026-01-15', nullable: true })
  minDate: string | null;

  @ApiPropertyOptional({ format: 'date', example: '2026-05-25', nullable: true })
  maxDate: string | null;
}
