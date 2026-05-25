import { executeOpenApiRequest, openapiClient } from '@/shared/api/openapi-client';
import type { CreateJournalEntryPayload, JournalEntry } from '../model/journal-entry.types';

export async function createEntry(
  journalId: string,
  payload: CreateJournalEntryPayload,
): Promise<JournalEntry> {
  return executeOpenApiRequest(
    await openapiClient.POST('/journals/{journalId}/entries', {
      params: { path: { journalId } },
      body: payload,
    }),
  );
}
