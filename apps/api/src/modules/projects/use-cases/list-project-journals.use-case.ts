import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { type ProjectJournalSummary } from '../types/project-dashboard-item.type';

@Injectable()
export class ListProjectJournalsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(projectId: string): Promise<ProjectJournalSummary[]> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!project) {
      throw new NotFoundException('Объект не найден');
    }
    const journals = await this.prisma.workJournal.findMany({
      where: { projectId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true },
    });
    return journals;
  }
}
