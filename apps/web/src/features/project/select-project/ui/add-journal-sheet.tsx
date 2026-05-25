'use client';

import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { ProjectJournal } from '@/entities/project';
import { cn } from '@/shared/lib';

type AddJournalSheetProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly projectName: string;
  readonly journals: ProjectJournal[];
  readonly openJournalIds: readonly string[];
  readonly onSelect: (journal: ProjectJournal) => void;
  readonly onCreateNew: () => void;
};

export function AddJournalSheet({
  open,
  onOpenChange,
  projectName,
  journals,
  openJournalIds,
  onSelect,
  onCreateNew,
}: AddJournalSheetProps): React.ReactElement {
  const [query, setQuery] = useState('');
  const inactiveJournals = useMemo(
    () => journals.filter((journal) => !openJournalIds.includes(journal.id)),
    [journals, openJournalIds],
  );
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return inactiveJournals;
    }
    return inactiveJournals.filter((journal) => {
      const title = journal.title ?? 'Журнал работ';
      return title.toLowerCase().includes(normalized);
    });
  }, [inactiveJournals, query]);
  const handleSelect = (journal: ProjectJournal): void => {
    onSelect(journal);
    onOpenChange(false);
    setQuery('');
  };
  const handleCreateNew = (): void => {
    onOpenChange(false);
    setQuery('');
    onCreateNew();
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Выберите журнал</SheetTitle>
          <SheetDescription>
            Объект «{projectName}» — выберите журнал или создайте новый
          </SheetDescription>
        </SheetHeader>
        <div className="relative mt-4">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            className="pl-9"
            placeholder="Поиск…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {filtered.map((journal) => (
            <button
              key={journal.id}
              type="button"
              onClick={() => handleSelect(journal)}
              className={cn(
                'flex w-full flex-col items-start gap-0.5 rounded-md border border-transparent px-3 py-2.5 text-left transition-colors',
                'hover:border-border/60 hover:bg-accent/40',
              )}
            >
              <span className="text-sm font-medium">{journal.title ?? 'Журнал работ'}</span>
            </button>
          ))}
          {filtered.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              {inactiveJournals.length === 0
                ? 'Все журналы уже открыты'
                : 'Ничего не найдено'}
            </p>
          ) : null}
        </div>
        <Button type="button" variant="outline" className="mt-4 w-full gap-2" onClick={handleCreateNew}>
          <Plus className="size-4" />
          Новый журнал
        </Button>
      </SheetContent>
    </Sheet>
  );
}
