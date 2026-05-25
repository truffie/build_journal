import { executeOpenApiRequest, openapiClient } from '@/shared/api/openapi-client';
import type { ProjectDashboardItem } from '../model/project.types';

export async function fetchProjects(): Promise<ProjectDashboardItem[]> {
  return executeOpenApiRequest(await openapiClient.GET('/projects'));
}
