'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchEntries } from '../api/get-entries';
import type { ListEntriesParams } from './journal-entry.types';

export function entriesQueryKey(journalId: string, params: ListEntriesParams) {
  return ['journals', journalId, 'entries', params] as const;
}

export function useEntriesQuery(journalId: string | null, params: ListEntriesParams) {
  return useQuery({
    queryKey: entriesQueryKey(journalId ?? '', params),
    queryFn: () => fetchEntries(journalId!, params),
    enabled: Boolean(journalId),
    placeholderData: keepPreviousData,
  });
}
