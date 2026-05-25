'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteEntry } from '@/entities/journal-entry';

type DeleteEntryDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly journalId: string;
  readonly entryId: string | null;
  readonly onSuccess?: () => void;
};

export function DeleteEntryDialog({
  open,
  onOpenChange,
  journalId,
  entryId,
  onSuccess,
}: DeleteEntryDialogProps): React.ReactElement {
  const deleteMutation = useDeleteEntry({
    journalId,
    onSuccess: () => {
      onSuccess?.();
      onOpenChange(false);
    },
  });
  const handleDelete = (): void => {
    if (!entryId) return;
    deleteMutation.mutate(entryId);
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
          <AlertDialogDescription>
            Запись будет скрыта из журнала. Это действие нельзя отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
