'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProjectJournals } from '../api/get-journals';

export function journalsQueryKey(projectId: string) {
  return ['projects', projectId, 'journals'] as const;
}

export function useJournalsQuery(projectId: string | null) {
  return useQuery({
    queryKey: journalsQueryKey(projectId ?? ''),
    queryFn: () => fetchProjectJournals(projectId!),
    enabled: Boolean(projectId),
  });
}
