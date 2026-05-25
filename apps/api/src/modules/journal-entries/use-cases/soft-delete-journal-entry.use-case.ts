import { Injectable, NotFoundException } from '@nestjs/common';
import { type JournalEntry } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../core/prisma/prisma.service';

@Injectable()
export class SoftDeleteJournalEntryUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(journalId: string, entryId: string): Promise<JournalEntry> {
    const entry = await this.findActiveEntry(journalId, entryId);
    return this.prisma.journalEntry.update({
      where: { id: entry.id },
      data: { deletedAt: new Date() },
    });
  }

  private async findActiveEntry(journalId: string, entryId: string): Promise<JournalEntry> {
    const entry = await this.prisma.journalEntry.findFirst({
      where: { id: entryId, journalId, deletedAt: null },
    });
    if (!entry) {
      throw new NotFoundException('Запись не найдена');
    }
    return entry;
  }
}
