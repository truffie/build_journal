'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { fetchWorkTypes } from '../api/get-work-types';
import type { WorkType } from './work-type.types';

export const WORK_TYPES_QUERY_KEY = ['work-types'] as const;

export function useWorkTypes() {
  const { data, isLoading, error } = useQuery({
    queryKey: WORK_TYPES_QUERY_KEY,
    queryFn: fetchWorkTypes,
    staleTime: 30 * 60 * 1000,
  });
  const workTypes: WorkType[] = data ?? [];
  const findWorkTypeById = useCallback(
    (id: number): WorkType | undefined => workTypes.find((item) => item.id === id),
    [workTypes],
  );
  return { workTypes, isLoading, error: error?.message ?? null, findWorkTypeById };
}
