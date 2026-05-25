import { executeOpenApiRequest, openapiClient } from '@/shared/api/openapi-client';
import type { WorkType } from '../model/work-type.types';

export async function fetchWorkTypes(): Promise<WorkType[]> {
  return executeOpenApiRequest(await openapiClient.GET('/work-types'));
}
