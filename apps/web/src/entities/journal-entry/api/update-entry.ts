import { executeOpenApiRequest, openapiClient } from '@/shared/api/openapi-client';
import type { JournalEntry, UpdateJournalEntryPayload } from '../model/journal-entry.types';

export async function updateEntry(
  journalId: string,
  entryId: string,
  payload: UpdateJournalEntryPayload,
): Promise<JournalEntry> {
  return executeOpenApiRequest(
    await openapiClient.PATCH('/journals/{journalId}/entries/{id}', {
      params: { path: { journalId, id: entryId } },
      body: payload,
    }),
  );
}
