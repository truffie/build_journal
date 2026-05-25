import { executeOpenApiRequest, openapiClient } from '@/shared/api/openapi-client';
import type { ProjectJournal } from '../model/project.types';

export type UpdateJournalTitlePayload = {
  readonly title: string;
};

export async function updateJournalTitle(
  journalId: string,
  payload: UpdateJournalTitlePayload,
): Promise<ProjectJournal> {
  return executeOpenApiRequest(
    await openapiClient.PATCH('/projects/journals/{journalId}/title', {
      params: { path: { journalId } },
      body: payload,
    }),
  );
}
