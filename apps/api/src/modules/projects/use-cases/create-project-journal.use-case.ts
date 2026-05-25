import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { type CreateProjectJournalDto } from '../dto/create-project-journal.dto';
import { type ProjectJournalSummary } from '../types/project-dashboard-item.type';

@Injectable()
export class CreateProjectJournalUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    projectId: string,
    dto: CreateProjectJournalDto,
    createdById: string,
  ): Promise<ProjectJournalSummary> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!project) {
      throw new NotFoundException('Объект не найден');
    }
    const journal = await this.prisma.workJournal.create({
      data: {
        projectId,
        title: dto.title.trim(),
        createdById,
      },
      select: { id: true, title: true },
    });
    return journal;
  }
}
