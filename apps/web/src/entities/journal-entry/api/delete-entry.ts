import { executeOpenApiRequest, openapiClient } from '@/shared/api/openapi-client';

export async function deleteEntry(journalId: string, entryId: string): Promise<void> {
  await executeOpenApiRequest(
    await openapiClient.DELETE('/journals/{journalId}/entries/{id}', {
      params: { path: { journalId, id: entryId } },
    }),
  );
}
