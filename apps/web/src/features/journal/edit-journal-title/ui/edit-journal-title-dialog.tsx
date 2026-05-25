'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { updateJournalTitle } from '@/entities';

type EditJournalTitleDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly journalId: string;
  readonly initialTitle: string;
  readonly onSuccess: () => void;
};

function EditJournalTitleForm({
  journalId,
  initialTitle,
  onSuccess,
  onClose,
}: {
  readonly journalId: string;
  readonly initialTitle: string;
  readonly onSuccess: () => void;
  readonly onClose: () => void;
}): React.ReactElement {
  const [title, setTitle] = useState(initialTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (): Promise<void> => {
    const trimmed = title.trim();
    if (!trimmed) {
      toast.error('Введите название журнала');
      return;
    }
    setIsSubmitting(true);
    try {
      await updateJournalTitle(journalId, { title: trimmed });
      toast.success('Название обновлено');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Не удалось сохранить');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="введите название"
        autoFocus
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            void handleSubmit();
          }
        }}
      />
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button type="button" disabled={isSubmitting} onClick={() => void handleSubmit()}>
          Сохранить
        </Button>
      </DialogFooter>
    </>
  );
}

export function EditJournalTitleDialog({
  open,
  onOpenChange,
  journalId,
  initialTitle,
  onSuccess,
}: EditJournalTitleDialogProps): React.ReactElement {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Название журнала</DialogTitle>
          <DialogDescription>Введите новое название журнала</DialogDescription>
        </DialogHeader>
        {open ? (
          <EditJournalTitleForm
            key={`${journalId}-${initialTitle}`}
            journalId={journalId}
            initialTitle={initialTitle}
            onSuccess={onSuccess}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
