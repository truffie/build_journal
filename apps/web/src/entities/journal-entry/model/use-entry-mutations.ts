'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createEntry } from '../api/create-entry';
import { updateEntry } from '../api/update-entry';
import { deleteEntry } from '../api/delete-entry';
import type { CreateJournalEntryPayload, UpdateJournalEntryPayload } from './journal-entry.types';

function entriesQueryPrefix(journalId: string) {
  return ['journals', journalId, 'entries'];
}

type UseCreateEntryOptions = {
  readonly journalId: string;
  readonly onSuccess?: () => void;
};

export function useCreateEntry({ journalId, onSuccess }: UseCreateEntryOptions) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateJournalEntryPayload) => createEntry(journalId, payload),
    onSuccess: () => {
      toast.success('Запись сохранена');
      void queryClient.invalidateQueries({ queryKey: entriesQueryPrefix(journalId) });
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Ошибка сохранения');
    },
  });
}

type UseUpdateEntryOptions = {
  readonly journalId: string;
  readonly onSuccess?: () => void;
};

export function useUpdateEntry({ journalId, onSuccess }: UseUpdateEntryOptions) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { entryId: string; payload: UpdateJournalEntryPayload }) =>
      updateEntry(journalId, variables.entryId, variables.payload),
    onSuccess: () => {
      toast.success('Запись обновлена');
      void queryClient.invalidateQueries({ queryKey: entriesQueryPrefix(journalId) });
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Ошибка сохранения');
    },
  });
}

type UseDeleteEntryOptions = {
  readonly journalId: string;
  readonly onSuccess?: () => void;
};

export function useDeleteEntry({ journalId, onSuccess }: UseDeleteEntryOptions) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entryId: string) => deleteEntry(journalId, entryId),
    onSuccess: () => {
      toast.success('Запись удалена');
      void queryClient.invalidateQueries({ queryKey: entriesQueryPrefix(journalId) });
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Ошибка удаления');
    },
  });
}
