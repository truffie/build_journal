import { Injectable } from '@nestjs/common';
import { type CreateProjectDto } from './dto/create-project.dto';
import { type CreateProjectJournalDto } from './dto/create-project-journal.dto';
import { type CreateProjectResult } from './types/create-project-result.type';
import {
  type ProjectDashboardItem,
  type ProjectJournalSummary,
} from './types/project-dashboard-item.type';
import { CreateProjectJournalUseCase } from './use-cases/create-project-journal.use-case';
import { CreateProjectUseCase } from './use-cases/create-project.use-case';
import { ListProjectJournalsUseCase } from './use-cases/list-project-journals.use-case';
import { ListProjectsUseCase } from './use-cases/list-projects.use-case';
import { UpdateJournalTitleUseCase } from './use-cases/update-journal-title.use-case';
import { UpdateProjectNameUseCase } from './use-cases/update-project-name.use-case';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly listProjectsUseCase: ListProjectsUseCase,
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly listProjectJournalsUseCase: ListProjectJournalsUseCase,
    private readonly createProjectJournalUseCase: CreateProjectJournalUseCase,
    private readonly updateJournalTitleUseCase: UpdateJournalTitleUseCase,
    private readonly updateProjectNameUseCase: UpdateProjectNameUseCase,
  ) {}

  findAll(): Promise<ProjectDashboardItem[]> {
    return this.listProjectsUseCase.execute();
  }

  create(dto: CreateProjectDto, createdById: string): Promise<CreateProjectResult> {
    return this.createProjectUseCase.execute(dto, createdById);
  }

  findJournals(projectId: string): Promise<ProjectJournalSummary[]> {
    return this.listProjectJournalsUseCase.execute(projectId);
  }

  createJournal(
    projectId: string,
    dto: CreateProjectJournalDto,
    createdById: string,
  ): Promise<ProjectJournalSummary> {
    return this.createProjectJournalUseCase.execute(projectId, dto, createdById);
  }

  updateJournalTitle(journalId: string, title: string): Promise<ProjectJournalSummary> {
    return this.updateJournalTitleUseCase.execute(journalId, title);
  }

  updateProjectName(projectId: string, name: string) {
    return this.updateProjectNameUseCase.execute(projectId, name);
  }
}
