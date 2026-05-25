import { Injectable, NotFoundException } from '@nestjs/common';
import { type JournalEntry } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { type UpdateJournalEntryDto } from '../dto/update-journal-entry.dto';
import { assertJournalEntryMutableUpdate } from '../utils/assert-mutable-update.util';

@Injectable()
export class UpdateJournalEntryUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    journalId: string,
    entryId: string,
    dto: UpdateJournalEntryDto,
  ): Promise<JournalEntry> {
    assertJournalEntryMutableUpdate(dto as Record<string, unknown>);
    const entry = await this.findActiveEntry(journalId, entryId);
    return this.prisma.journalEntry.update({
      where: { id: entry.id },
      data: {
        workDate: dto.workDate !== undefined ? new Date(dto.workDate) : entry.workDate,
        workTypeSnapshot: dto.workTypeSnapshot ?? entry.workTypeSnapshot,
        unitSnapshot: dto.unitSnapshot ?? entry.unitSnapshot,
        volume: dto.volume !== undefined ? dto.volume : entry.volume,
        workerNameSnapshot: dto.workerNameSnapshot ?? entry.workerNameSnapshot,
        orderIndex: dto.orderIndex ?? entry.orderIndex,
        locationSection:
          dto.locationSection !== undefined ? dto.locationSection : entry.locationSection,
        locationFloor: dto.locationFloor !== undefined ? dto.locationFloor : entry.locationFloor,
        locationAxes: dto.locationAxes !== undefined ? dto.locationAxes : entry.locationAxes,
        conditionsText:
          dto.conditionsText !== undefined ? dto.conditionsText : entry.conditionsText,
        notes: dto.notes !== undefined ? dto.notes : entry.notes,
      },
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
