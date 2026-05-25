import type { components } from './generated/schema';

type ApiSchemas = components['schemas'];

export type AuthUser = ApiSchemas['AuthUserResponseDto'];
export type Session = ApiSchemas['LoginResponseDto'];
export type ProjectJournal = ApiSchemas['ProjectJournalSummaryDto'];
export type ProjectDashboardItem = ApiSchemas['ProjectDashboardItemDto'];
export type CreateProjectPayload = ApiSchemas['CreateProjectDto'];
export type CreateProjectResult = ApiSchemas['CreateProjectResponseDto'];
export type JournalEntry = ApiSchemas['JournalEntryResponseDto'];
export type PaginatedJournalEntries = ApiSchemas['PaginatedJournalEntriesResponseDto'];
export type CreateJournalEntryPayload = ApiSchemas['CreateJournalEntryDto'];
export type UpdateJournalEntryPayload = ApiSchemas['UpdateJournalEntryDto'];

export type ListEntriesParams = {
  readonly page?: number;
  readonly limit?: number;
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly sortDate?: 'asc' | 'desc';
};
