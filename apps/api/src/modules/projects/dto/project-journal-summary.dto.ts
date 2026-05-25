import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectJournalSummaryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'Журнал работ — май 2026' })
  title: string | null;
}
