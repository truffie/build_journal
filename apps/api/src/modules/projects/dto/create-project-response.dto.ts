import { ApiProperty } from '@nestjs/swagger';
import { CreateProjectResponseProjectDto } from './create-project-response-project.dto';
import { ProjectJournalSummaryDto } from './project-journal-summary.dto';

export class CreateProjectResponseDto {
  @ApiProperty({ type: CreateProjectResponseProjectDto })
  project: CreateProjectResponseProjectDto;

  @ApiProperty({ type: ProjectJournalSummaryDto })
  journal: ProjectJournalSummaryDto;
}
