import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { type ListJournalEntriesQueryDto } from '../dto/list-journal-entries-query.dto';
import { type PaginatedJournalEntries } from '../types/paginated-journal-entries.type';

@Injectable()
export class ListJournalEntriesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    journalId: string,
    query: ListJournalEntriesQueryDto,
  ): Promise<PaginatedJournalEntries> {
    await this.assertJournalExists(journalId);
    const where: Prisma.JournalEntryWhereInput = {
      journalId,
      deletedAt: null,
      ...this.buildWorkDateFilter(query),
    };
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const dateDirection = query.sortDate ?? 'desc';
    const allEntriesWhere: Prisma.JournalEntryWhereInput = { journalId, deletedAt: null };
    const [items, total, dateRange] = await Promise.all([
      this.prisma.journalEntry.findMany({
        where,
        orderBy: [{ workDate: dateDirection }, { orderIndex: dateDirection }],
        skip,
        take: limit,
      }),
      this.prisma.journalEntry.count({ where }),
      this.prisma.journalEntry.aggregate({
        where: allEntriesWhere,
        _min: { workDate: true },
        _max: { workDate: true },
      }),
    ]);
    const minDate = dateRange._min.workDate
      ? dateRange._min.workDate.toISOString().slice(0, 10)
      : null;
    const maxDate = dateRange._max.workDate
      ? dateRange._max.workDate.toISOString().slice(0, 10)
      : null;
    return {
      items,
      total,
      page,
      limit,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      minDate,
      maxDate,
    };
  }

  private async assertJournalExists(journalId: string): Promise<void> {
    const journal = await this.prisma.workJournal.findFirst({
      where: { id: journalId, deletedAt: null },
    });
    if (!journal) {
      throw new NotFoundException('Журнал не найден');
    }
  }

  private buildWorkDateFilter(query: ListJournalEntriesQueryDto): Prisma.JournalEntryWhereInput {
    if (!query.fromDate && !query.toDate) {
      return {};
    }
    const workDate: Prisma.DateTimeFilter = {};
    if (query.fromDate) {
      workDate.gte = new Date(query.fromDate);
    }
    if (query.toDate) {
      workDate.lte = new Date(query.toDate);
    }
    return { workDate };
  }
}
