'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { JournalSidebar } from './journal-sidebar';
import type { ProjectJournal } from '@/entities';

type MobileJournalDrawerProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly projectName: string;
  readonly activeJournalTitle: string | null;
  readonly journals: ProjectJournal[];
  readonly activeJournalId: string | null;
  readonly isLoading: boolean;
  readonly onSelectJournal: (journalId: string) => void;
  readonly onAddJournal: () => void;
  readonly onJournalTitleUpdated: () => void;
};

export function MobileJournalDrawer({
  open,
  onOpenChange,
  projectName,
  activeJournalTitle,
  journals,
  activeJournalId,
  isLoading,
  onSelectJournal,
  onAddJournal,
  onJournalTitleUpdated,
}: MobileJournalDrawerProps): React.ReactElement {
  return (
    <div className="flex items-center gap-2 border-b border-border/40 px-3 py-2 lg:hidden">
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="gap-1.5">
            <Menu className="size-3.5" />
            Журналы
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[min(100%,280px)] p-0">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="text-left text-sm">{projectName}</SheetTitle>
            <SheetDescription className="sr-only">Список журналов объекта</SheetDescription>
          </SheetHeader>
          <JournalSidebar
            journals={journals}
            activeJournalId={activeJournalId}
            isLoading={isLoading}
            onSelectJournal={onSelectJournal}
            onAddJournal={onAddJournal}
            onJournalTitleUpdated={onJournalTitleUpdated}
            className="h-[calc(100%-3.5rem)] border-0"
          />
        </SheetContent>
      </Sheet>
      <span className="text-muted-foreground min-w-0 flex-1 truncate text-xs">
        {activeJournalTitle ?? 'Выберите журнал'}
      </span>
    </div>
  );
}
