import { executeOpenApiRequest, openapiClient } from '@/shared/api/openapi-client';
import type { ProjectJournal } from '../model/project.types';

export async function fetchProjectJournals(projectId: string): Promise<ProjectJournal[]> {
  return executeOpenApiRequest(
    await openapiClient.GET('/projects/{projectId}/journals', {
      params: { path: { projectId } },
    }),
  );
}
