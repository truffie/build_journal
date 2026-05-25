import { executeOpenApiRequest, openapiClient } from '@/shared/api/openapi-client';
import type { CreateProjectPayload, CreateProjectResult } from '../model/project.types';

export async function createProject(payload: CreateProjectPayload): Promise<CreateProjectResult> {
  return executeOpenApiRequest(
    await openapiClient.POST('/projects', {
      body: payload,
    }),
  );
}
