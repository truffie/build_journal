import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../../../../generated/prisma/client';
import { ProjectJournalSummaryDto } from './project-journal-summary.dto';

export class ProjectDashboardItemDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'ЖК «Северный», корпус 1' })
  name: string;

  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: ProjectJournalSummaryDto })
  journal: ProjectJournalSummaryDto;
}
