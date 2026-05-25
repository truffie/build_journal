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
import { updateProjectName } from '@/entities';

type EditProjectNameDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly projectId: string;
  readonly initialName: string;
  readonly onSuccess: (newName: string) => void;
};

function EditProjectNameForm({
  projectId,
  initialName,
  onSuccess,
  onClose,
}: {
  readonly projectId: string;
  readonly initialName: string;
  readonly onSuccess: (newName: string) => void;
  readonly onClose: () => void;
}): React.ReactElement {
  const [name, setName] = useState(initialName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (): Promise<void> => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      toast.error('Минимум 2 символа');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await updateProjectName(projectId, { name: trimmed });
      toast.success('Название обновлено');
      onSuccess(result.name);
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
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Объект строительства"
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

export function EditProjectNameDialog({
  open,
  onOpenChange,
  projectId,
  initialName,
  onSuccess,
}: EditProjectNameDialogProps): React.ReactElement {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Название объекта</DialogTitle>
          <DialogDescription>Введите новое название объекта</DialogDescription>
        </DialogHeader>
        {open ? (
          <EditProjectNameForm
            key={`${projectId}-${initialName}`}
            projectId={projectId}
            initialName={initialName}
            onSuccess={onSuccess}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
