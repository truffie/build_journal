'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchProjectJournals, journalsQueryKey } from '@/entities/project';

const PREFETCH_STALE_TIME = 60_000;

export function usePrefetchProject(activeProjectId: string | null) {
  const queryClient = useQueryClient();
  return useCallback(
    (projectId: string) => {
      if (projectId === activeProjectId) return;
      void queryClient.prefetchQuery({
        queryKey: journalsQueryKey(projectId),
        queryFn: () => fetchProjectJournals(projectId),
        staleTime: PREFETCH_STALE_TIME,
      });
    },
    [queryClient, activeProjectId],
  );
}
