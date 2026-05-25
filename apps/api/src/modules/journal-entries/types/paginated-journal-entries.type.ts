import { type JournalEntry } from '../../../../generated/prisma/client';

export type PaginatedJournalEntries = {
  readonly items: JournalEntry[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
  readonly minDate: string | null;
  readonly maxDate: string | null;
};
