import { Injectable } from '@nestjs/common';
import { type JournalEntry } from '../../../generated/prisma/client';
import { type CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { type ListJournalEntriesQueryDto } from './dto/list-journal-entries-query.dto';
import { type UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { type PaginatedJournalEntries } from './types/paginated-journal-entries.type';
import { CreateJournalEntryUseCase } from './use-cases/create-journal-entry.use-case';
import { ListJournalEntriesUseCase } from './use-cases/list-journal-entries.use-case';
import { SoftDeleteJournalEntryUseCase } from './use-cases/soft-delete-journal-entry.use-case';
import { UpdateJournalEntryUseCase } from './use-cases/update-journal-entry.use-case';

@Injectable()
export class JournalEntriesService {
  constructor(
    private readonly listJournalEntriesUseCase: ListJournalEntriesUseCase,
    private readonly createJournalEntryUseCase: CreateJournalEntryUseCase,
    private readonly updateJournalEntryUseCase: UpdateJournalEntryUseCase,
    private readonly softDeleteJournalEntryUseCase: SoftDeleteJournalEntryUseCase,
  ) {}

  findByJournal(
    journalId: string,
    query: ListJournalEntriesQueryDto,
  ): Promise<PaginatedJournalEntries> {
    return this.listJournalEntriesUseCase.execute(journalId, query);
  }

  create(
    journalId: string,
    dto: CreateJournalEntryDto,
    createdById: string,
  ): Promise<JournalEntry> {
    return this.createJournalEntryUseCase.execute(journalId, dto, createdById);
  }

  update(journalId: string, entryId: string, dto: UpdateJournalEntryDto): Promise<JournalEntry> {
    return this.updateJournalEntryUseCase.execute(journalId, entryId, dto);
  }

  softDelete(journalId: string, entryId: string): Promise<JournalEntry> {
    return this.softDeleteJournalEntryUseCase.execute(journalId, entryId);
  }
}
