'use client';

import { memo, useState } from 'react';
import { EditProjectNameDialog } from '@/features/project/edit-project-name';
import type { OpenProjectTab } from '@/entities';
import { usePrefetchProject } from '../model/use-prefetch-project';
import { WorkspaceActions } from './workspace-actions';
import { WorkspaceTabs } from './workspace-tabs';

type WorkspaceHeaderProps = {
  readonly tabs: OpenProjectTab[];
  readonly activeProjectId: string | null;
  readonly onSelectProject: (projectId: string) => void;
  readonly onCloseProject: (projectId: string) => void;
  readonly onAddObject: () => void;
  readonly onSignOut: () => void;
  readonly onProjectRenamed: (projectId: string, newName: string) => void;
};

export const WorkspaceHeader = memo(function WorkspaceHeader({
  tabs,
  activeProjectId,
  onSelectProject,
  onCloseProject,
  onAddObject,
  onSignOut,
  onProjectRenamed,
}: WorkspaceHeaderProps): React.ReactElement {
  const prefetchProject = usePrefetchProject(activeProjectId);
  const [editingProject, setEditingProject] = useState<{ id: string; name: string } | null>(null);
  return (
    <>
      <header className="flex items-center gap-2 border-b border-border/60 bg-background/80 px-2 py-1.5 backdrop-blur">
        <WorkspaceTabs
          tabs={tabs}
          activeProjectId={activeProjectId}
          onSelectProject={onSelectProject}
          onCloseProject={onCloseProject}
          onAddObject={onAddObject}
          onRenameProject={setEditingProject}
          onPrefetch={prefetchProject}
        />
        <WorkspaceActions onSignOut={onSignOut} />
      </header>
      {editingProject ? (
        <EditProjectNameDialog
          open={Boolean(editingProject)}
          onOpenChange={(open) => { if (!open) setEditingProject(null); }}
          projectId={editingProject.id}
          initialName={editingProject.name}
          onSuccess={(newName) => {
            onProjectRenamed(editingProject.id, newName);
            setEditingProject(null);
          }}
        />
      ) : null}
    </>
  );
});
