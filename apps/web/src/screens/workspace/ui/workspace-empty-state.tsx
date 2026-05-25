'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EmptyReason = 'empty-journal' | 'no-journal' | 'no-project' | 'no-filter-results';

type WorkspaceEmptyStateProps = {
  readonly reason: EmptyReason;
  readonly onAction: () => void;
};

export function WorkspaceEmptyState({ reason, onAction }: WorkspaceEmptyStateProps): React.ReactElement {
  switch (reason) {
    case 'empty-journal':
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
          <p className="text-muted-foreground text-sm">Журнал пуст</p>
          <Button type="button" size="lg" className="gap-2" onClick={onAction}>
            <Plus className="size-4" />
            Добавить запись
          </Button>
        </div>
      );
    case 'no-filter-results':
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
          <p className="text-muted-foreground text-sm">Нет записей за выбранный период</p>
          <Button type="button" variant="outline" size="sm" onClick={onAction}>
            Сбросить фильтр
          </Button>
        </div>
      );
    case 'no-journal':
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
          <p className="text-muted-foreground text-center text-sm">Выберите журнал</p>
          <Button type="button" variant="outline" size="sm" className="lg:hidden" onClick={onAction}>
            Открыть список журналов
          </Button>
        </div>
      );
    case 'no-project':
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
          <p className="text-muted-foreground text-center text-sm">Добавьте объект</p>
          <Button type="button" variant="outline" size="sm" onClick={onAction}>
            Добавить объект
          </Button>
        </div>
      );
  }
}
