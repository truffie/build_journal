import { executeOpenApiRequest, openapiClient } from '@/shared/api/openapi-client';
import type { ProjectJournal } from '../model/project.types';

export type CreateProjectJournalPayload = {
  readonly title: string;
};

export async function createProjectJournal(
  projectId: string,
  payload: CreateProjectJournalPayload,
): Promise<ProjectJournal> {
  return executeOpenApiRequest(
    await openapiClient.POST('/projects/{projectId}/journals', {
      params: { path: { projectId } },
      body: payload,
    }),
  );
}
