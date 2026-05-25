import { Injectable, NotFoundException } from '@nestjs/common';
import { type JournalEntry, Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { WorkTypeSnapshot } from '../../../shared/value-objects/work-type-snapshot.vo';
import { WorkerSnapshot } from '../../../shared/value-objects/worker-snapshot.vo';
import { type CreateJournalEntryDto } from '../dto/create-journal-entry.dto';

@Injectable()
export class CreateJournalEntryUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    journalId: string,
    dto: CreateJournalEntryDto,
    createdById: string,
  ): Promise<JournalEntry> {
    await this.assertJournalAcceptsEntries(journalId);
    const workType = await this.prisma.workType.findFirst({
      where: { id: dto.workTypeId, isActive: true },
    });
    if (!workType) {
      throw new NotFoundException('Вид работ не найден или неактивен');
    }
    const unit = dto.unitOverride ?? workType.defaultUnit;
    const workTypeSnapshot = WorkTypeSnapshot.fromStrings(workType.name, unit);
    const workerSnapshot = WorkerSnapshot.fromName(dto.workerName);
    const orderIndex =
      dto.orderIndex ?? (await this.resolveNextOrderIndex(journalId, dto.workDate));
    const snapshots = workTypeSnapshot.toPersistence();
    const worker = workerSnapshot.toPersistence();
    return this.prisma.journalEntry.create({
      data: {
        journalId,
        workDate: new Date(dto.workDate),
        workTypeSnapshot: snapshots.workTypeSnapshot,
        unitSnapshot: snapshots.unitSnapshot,
        volume: new Prisma.Decimal(dto.volume),
        workerId: worker.workerId,
        workerNameSnapshot: worker.workerNameSnapshot,
        orderIndex,
        locationSection: dto.locationSection ?? null,
        locationFloor: dto.locationFloor ?? null,
        locationAxes: dto.locationAxes ?? null,
        conditionsText: dto.conditionsText ?? null,
        notes: dto.notes ?? null,
        createdById,
      },
    });
  }

  private async assertJournalAcceptsEntries(journalId: string): Promise<void> {
    const journal = await this.prisma.workJournal.findFirst({
      where: { id: journalId, deletedAt: null },
    });
    if (!journal) {
      throw new NotFoundException('Журнал не найден');
    }
  }

  private async resolveNextOrderIndex(journalId: string, workDate: string): Promise<number> {
    const parsedDate = new Date(workDate);
    const aggregate = await this.prisma.journalEntry.aggregate({
      where: {
        journalId,
        workDate: parsedDate,
        deletedAt: null,
      },
      _max: { orderIndex: true },
    });
    return (aggregate._max.orderIndex ?? 0) + 1;
  }
}
