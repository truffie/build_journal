import { Module } from '@nestjs/common';
import { CreateProjectJournalUseCase } from './use-cases/create-project-journal.use-case';
import { CreateProjectUseCase } from './use-cases/create-project.use-case';
import { ListProjectJournalsUseCase } from './use-cases/list-project-journals.use-case';
import { ListProjectsUseCase } from './use-cases/list-projects.use-case';
import { UpdateJournalTitleUseCase } from './use-cases/update-journal-title.use-case';
import { UpdateProjectNameUseCase } from './use-cases/update-project-name.use-case';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ListProjectsUseCase,
    CreateProjectUseCase,
    ListProjectJournalsUseCase,
    CreateProjectJournalUseCase,
    UpdateJournalTitleUseCase,
    UpdateProjectNameUseCase,
  ],
})
export class ProjectsModule {}
