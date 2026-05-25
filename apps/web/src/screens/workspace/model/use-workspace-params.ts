'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export type WorkspaceParams = {
  readonly projectId: string | null;
  readonly journalId: string | null;
  readonly page: number;
  readonly fromDate: string | null;
  readonly toDate: string | null;
  readonly sortDate: 'asc' | 'desc';
};

export function useWorkspaceParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params: WorkspaceParams = useMemo(
    () => ({
      projectId: searchParams.get('projectId'),
      journalId: searchParams.get('journalId'),
      page: Number(searchParams.get('page')) || 1,
      fromDate: searchParams.get('fromDate'),
      toDate: searchParams.get('toDate'),
      sortDate: (searchParams.get('sortDate') as 'asc' | 'desc') || 'desc',
    }),
    [searchParams],
  );
  const setParams = useCallback(
    (updates: Partial<WorkspaceParams>) => {
      const next = new URLSearchParams(searchParams.toString());
      const merged = { ...params, ...updates };
      if (merged.projectId) {
        next.set('projectId', merged.projectId);
      } else {
        next.delete('projectId');
      }
      if (merged.journalId) {
        next.set('journalId', merged.journalId);
      } else {
        next.delete('journalId');
      }
      if (merged.page && merged.page > 1) {
        next.set('page', String(merged.page));
      } else {
        next.delete('page');
      }
      if (merged.fromDate) {
        next.set('fromDate', merged.fromDate);
      } else {
        next.delete('fromDate');
      }
      if (merged.toDate) {
        next.set('toDate', merged.toDate);
      } else {
        next.delete('toDate');
      }
      if (merged.sortDate && merged.sortDate !== 'desc') {
        next.set('sortDate', merged.sortDate);
      } else {
        next.delete('sortDate');
      }
      const qs = next.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [params, pathname, router, searchParams],
  );
  const selectProject = useCallback(
    (projectId: string) => {
      if (projectId === params.projectId) {
        return;
      }
      setParams({ projectId, journalId: null, page: 1, fromDate: null, toDate: null });
    },
    [params.projectId, setParams],
  );
  const selectJournal = useCallback(
    (journalId: string) => {
      if (journalId === params.journalId) {
        return;
      }
      setParams({
        journalId,
        page: 1,
        fromDate: null,
        toDate: null,
        sortDate: 'desc',
      });
    },
    [params.journalId, setParams],
  );
  const setPage = useCallback(
    (page: number) => {
      setParams({ page });
    },
    [setParams],
  );
  const setDateRange = useCallback(
    (fromDate: string | null, toDate: string | null) => {
      setParams({ fromDate, toDate, page: 1 });
    },
    [setParams],
  );
  const resetDateRange = useCallback(() => {
    setParams({ fromDate: null, toDate: null, page: 1 });
  }, [setParams]);
  const toggleSortDate = useCallback(() => {
    setParams({ sortDate: params.sortDate === 'desc' ? 'asc' : 'desc', page: 1 });
  }, [params.sortDate, setParams]);
  return { params, selectProject, selectJournal, setPage, setDateRange, resetDateRange, toggleSortDate };
}
