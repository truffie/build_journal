import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import type { ProjectJournalSummary } from '../types/project-dashboard-item.type';

@Injectable()
export class UpdateJournalTitleUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(journalId: string, title: string): Promise<ProjectJournalSummary> {
    const journal = await this.prisma.workJournal.findUnique({ where: { id: journalId } });
    if (!journal) {
      throw new NotFoundException('Журнал не найден');
    }
    const updated = await this.prisma.workJournal.update({
      where: { id: journalId },
      data: { title },
      select: { id: true, title: true },
    });
    return updated;
  }
}
