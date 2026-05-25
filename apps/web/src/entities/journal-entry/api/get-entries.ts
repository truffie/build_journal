import { executeOpenApiRequest, openapiClient } from '@/shared/api/openapi-client';
import type { ListEntriesParams, PaginatedJournalEntries } from '../model/journal-entry.types';

export async function fetchEntries(
  journalId: string,
  params: ListEntriesParams = {},
): Promise<PaginatedJournalEntries> {
  return executeOpenApiRequest(
    await openapiClient.GET('/journals/{journalId}/entries', {
      params: {
        path: { journalId },
        query: params,
      },
    }),
  );
}
