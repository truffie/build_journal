import { Body, Controller, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateProjectJournalDto } from './dto/create-project-journal.dto';
import { CreateProjectResponseDto } from './dto/create-project-response.dto';
import { ProjectDashboardItemDto } from './dto/project-dashboard-item.dto';
import { ProjectJournalSummaryDto } from './dto/project-journal-summary.dto';
import { ProjectNameResponseDto } from './dto/project-name-response.dto';
import { UpdateJournalTitleDto } from './dto/update-journal-title.dto';
import { UpdateProjectNameDto } from './dto/update-project-name.dto';
import { ProjectsService } from './projects.service';
import type { CreateProjectResult } from './types/create-project-result.type';
import type {
  ProjectDashboardItem,
  ProjectJournalSummary,
} from './types/project-dashboard-item.type';

@ApiTags('projects')
@ApiBearerAuth('access-token')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Дашборд: список объектов' })
  @ApiOkResponse({ type: ProjectDashboardItemDto, isArray: true })
  findAll(): Promise<ProjectDashboardItem[]> {
    return this.projectsService.findAll();
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Создать объект и журнал' })
  @ApiCreatedResponse({ type: CreateProjectResponseDto })
  create(
    @Body() dto: CreateProjectDto,
    @CurrentUser('sub') userId: string,
  ): Promise<CreateProjectResult> {
    return this.projectsService.create(dto, userId);
  }

  @Get(':projectId/journals')
  @ApiOperation({ summary: 'Журналы объекта' })
  @ApiOkResponse({ type: ProjectJournalSummaryDto, isArray: true })
  findJournals(@Param('projectId') projectId: string): Promise<ProjectJournalSummary[]> {
    return this.projectsService.findJournals(projectId);
  }

  @Post(':projectId/journals')
  @HttpCode(201)
  @ApiOperation({ summary: 'Создать журнал для объекта' })
  @ApiCreatedResponse({ type: ProjectJournalSummaryDto })
  createJournal(
    @Param('projectId') projectId: string,
    @Body() dto: CreateProjectJournalDto,
    @CurrentUser('sub') userId: string,
  ): Promise<ProjectJournalSummary> {
    return this.projectsService.createJournal(projectId, dto, userId);
  }

  @Patch(':projectId/name')
  @ApiOperation({ summary: 'Переименовать объект' })
  @ApiOkResponse({ type: ProjectNameResponseDto })
  updateProjectName(
    @Param('projectId') projectId: string,
    @Body() dto: UpdateProjectNameDto,
  ): Promise<ProjectNameResponseDto> {
    return this.projectsService.updateProjectName(projectId, dto.name);
  }

  @Patch('journals/:journalId/title')
  @ApiOperation({ summary: 'Переименовать журнал' })
  @ApiOkResponse({ type: ProjectJournalSummaryDto })
  updateJournalTitle(
    @Param('journalId') journalId: string,
    @Body() dto: UpdateJournalTitleDto,
  ): Promise<ProjectJournalSummary> {
    return this.projectsService.updateJournalTitle(journalId, dto.title);
  }
}
