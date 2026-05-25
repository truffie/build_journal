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
import type { ProjectDashboardItem } from '@/entities/project';
import { cn } from '@/shared/lib';

type AddObjectSheetProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly projects: ProjectDashboardItem[];
  readonly openProjectIds: readonly string[];
  readonly onSelect: (project: ProjectDashboardItem) => void;
  readonly onCreateNew: () => void;
};

export function AddObjectSheet({
  open,
  onOpenChange,
  projects,
  openProjectIds,
  onSelect,
  onCreateNew,
}: AddObjectSheetProps): React.ReactElement {
  const [query, setQuery] = useState('');
  const inactiveProjects = useMemo(
    () => projects.filter((project) => !openProjectIds.includes(project.id)),
    [openProjectIds, projects],
  );
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return inactiveProjects;
    }
    return inactiveProjects.filter((project) => project.name.toLowerCase().includes(normalized));
  }, [inactiveProjects, query]);
  const handleSelect = (project: ProjectDashboardItem): void => {
    onSelect(project);
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
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md px-4 pb-4">
        <SheetHeader>
          <SheetTitle>Выберите объект</SheetTitle>
          <SheetDescription>Выберите объект из списка или создайте новый</SheetDescription>
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
          {filtered.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => handleSelect(project)}
              className={cn(
                'flex w-full flex-col items-start gap-0.5 rounded-md border border-transparent px-3 py-2.5 text-left transition-colors',
                'hover:border-border/60 hover:bg-accent/40',
              )}
            >
              <span className="text-sm font-medium">{project.name}</span>
            </button>
          ))}
          {filtered.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              {inactiveProjects.length === 0 ? 'Все объекты уже открыты' : 'Ничего не найдено'}
            </p>
          ) : null}
        </div>
        <Button type="button" variant="outline" className="mt-4 w-full gap-2" onClick={handleCreateNew}>
          <Plus className="size-4" />
          Новый объект
        </Button>
      </SheetContent>
    </Sheet>
  );
}
