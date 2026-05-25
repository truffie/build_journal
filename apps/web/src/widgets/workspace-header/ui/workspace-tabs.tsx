'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OpenProjectTab } from '@/entities';
import { ProjectTab } from './project-tab';

type WorkspaceTabsProps = {
  readonly tabs: OpenProjectTab[];
  readonly activeProjectId: string | null;
  readonly onSelectProject: (projectId: string) => void;
  readonly onCloseProject: (projectId: string) => void;
  readonly onAddObject: () => void;
  readonly onRenameProject: (project: { id: string; name: string }) => void;
  readonly onPrefetch: (projectId: string) => void;
};

export function WorkspaceTabs({
  tabs,
  activeProjectId,
  onSelectProject,
  onCloseProject,
  onAddObject,
  onRenameProject,
  onPrefetch,
}: WorkspaceTabsProps): React.ReactElement {
  return (
    <div role="tablist" className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
      {tabs.map((tab) => (
        <ProjectTab
          key={tab.projectId}
          tab={tab}
          active={tab.projectId === activeProjectId}
          canClose={tabs.length > 1}
          onSelect={onSelectProject}
          onClose={onCloseProject}
          onRename={onRenameProject}
          onPrefetch={onPrefetch}
        />
      ))}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7 shrink-0"
        onClick={onAddObject}
        aria-label="Добавить объект"
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}
