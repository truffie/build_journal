import { executeOpenApiRequest, openapiClient } from '@/shared/api/openapi-client';

export type UpdateProjectNamePayload = {
  readonly name: string;
};

export type ProjectNameResult = {
  readonly id: string;
  readonly name: string;
};

export async function updateProjectName(
  projectId: string,
  payload: UpdateProjectNamePayload,
): Promise<ProjectNameResult> {
  return executeOpenApiRequest(
    await openapiClient.PATCH('/projects/{projectId}/name', {
      params: { path: { projectId } },
      body: payload,
    }),
  );
}
