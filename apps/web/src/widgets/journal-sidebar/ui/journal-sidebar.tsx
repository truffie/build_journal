'use client';

import { Pencil, Plus } from 'lucide-react';
import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EditJournalTitleDialog } from '@/features/journal/edit-journal-title';
import { cn } from '@/shared/lib';
import type { ProjectJournal } from '@/entities/project';

type JournalSidebarProps = {
  readonly journals: ProjectJournal[];
  readonly activeJournalId: string | null;
  readonly isLoading: boolean;
  readonly onSelectJournal: (journalId: string) => void;
  readonly onAddJournal: () => void;
  readonly onJournalTitleUpdated: () => void;
  readonly className?: string;
};

export const JournalSidebar = memo(function JournalSidebar({
  journals,
  activeJournalId,
  isLoading,
  onSelectJournal,
  onAddJournal,
  onJournalTitleUpdated,
  className,
}: JournalSidebarProps): React.ReactElement {
  const [editingJournal, setEditingJournal] = useState<ProjectJournal | null>(null);
  return (
    <>
      <aside
        className={cn(
          'flex w-full shrink-0 flex-col border-border/60 bg-muted/20 lg:w-56 lg:border-r',
          className,
        )}
      >
        <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-1.5 py-2">
          {isLoading ? (
            <p className="text-muted-foreground px-2 py-4 text-center text-xs">Загрузка…</p>
          ) : journals.length === 0 ? (
            <p className="text-muted-foreground px-2 py-4 text-center text-xs">Нет журналов</p>
          ) : (
            journals.map((journal) => {
              const isActive = journal.id === activeJournalId;
              return (
                <div
                  key={journal.id}
                  className={cn(
                    'group relative flex w-full items-center rounded-md transition-colors',
                    isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectJournal(journal.id)}
                    className="min-w-0 flex-1 px-2.5 py-2 pr-8 text-left"
                  >
                    <span className="line-clamp-2 text-sm leading-snug font-medium">
                      {journal.title ?? 'Журнал работ'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'text-muted-foreground hover:text-warning absolute top-1/2 right-1.5 -translate-y-1/2 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100',
                      isActive && 'opacity-100',
                    )}
                    onClick={(event) => {
                      event.stopPropagation();
                      setEditingJournal(journal);
                    }}
                    aria-label="Изменить название"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </nav>
        <div className="border-t border-border/60 p-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-1.5"
            onClick={onAddJournal}
          >
            <Plus className="size-3.5" />
            Добавить журнал
          </Button>
        </div>
      </aside>
      {editingJournal ? (
        <EditJournalTitleDialog
          open
          onOpenChange={(open) => {
            if (!open) {
              setEditingJournal(null);
            }
          }}
          journalId={editingJournal.id}
          initialTitle={editingJournal.title ?? ''}
          onSuccess={onJournalTitleUpdated}
        />
      ) : null}
    </>
  );
});
