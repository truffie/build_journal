'use client';

import { Pencil, X } from 'lucide-react';
import { memo } from 'react';
import { cn } from '@/shared/lib';
import type { OpenProjectTab } from '@/entities';

type ProjectTabProps = {
  readonly tab: OpenProjectTab;
  readonly active: boolean;
  readonly canClose: boolean;
  readonly onSelect: (projectId: string) => void;
  readonly onClose: (projectId: string) => void;
  readonly onRename: (project: { id: string; name: string }) => void;
  readonly onPrefetch: (projectId: string) => void;
};

export const ProjectTab = memo(function ProjectTab({
  tab,
  active,
  canClose,
  onSelect,
  onClose,
  onRename,
  onPrefetch,
}: ProjectTabProps): React.ReactElement {
  return (
    <div
      role="tab"
      aria-selected={active}
      className={cn(
        'group flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 transition-colors',
        active ? 'bg-accent' : 'hover:bg-accent/50',
      )}
      onMouseEnter={() => onPrefetch(tab.projectId)}
    >
      <button
        type="button"
        onClick={() => onSelect(tab.projectId)}
        onDoubleClick={() => onRename({ id: tab.projectId, name: tab.name })}
        className={cn(
          'max-w-[160px] truncate text-sm transition-colors',
          active ? 'text-accent-foreground font-medium' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        {tab.name}
      </button>
      <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          className="text-muted-foreground hover:text-warning rounded p-1"
          onClick={(event) => {
            event.stopPropagation();
            onRename({ id: tab.projectId, name: tab.name });
          }}
          aria-label="Переименовать"
        >
          <Pencil className="size-3" />
        </button>
        {canClose ? (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground rounded p-1"
            onClick={(event) => {
              event.stopPropagation();
              onClose(tab.projectId);
            }}
            aria-label="Закрыть"
          >
            <X className="size-3" />
          </button>
        ) : null}
      </div>
    </div>
  );
});
