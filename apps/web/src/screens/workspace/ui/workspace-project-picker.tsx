'use client';

import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateProjectSheet } from '@/features/project/create-project';
import type { ProjectDashboardItem } from '@/entities';
import { useWorkspaceDialogs } from '../model/workspace-dialogs-store';
import { cn } from '@/shared/lib';

type WorkspaceProjectPickerProps = {
  readonly projects: ProjectDashboardItem[];
  readonly onAddObject: (project: ProjectDashboardItem) => void;
  readonly onProjectCreated: (project: ProjectDashboardItem) => void;
};

export function WorkspaceProjectPicker({
  projects,
  onAddObject,
  onProjectCreated,
}: WorkspaceProjectPickerProps): React.ReactElement {
  const dialogs = useWorkspaceDialogs();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6">
      <div className="max-w-sm text-center">
        <h1 className="text-lg font-semibold">Выберите объект</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Выберите объект из списка или создайте новый, чтобы начать работу с журналами.
        </p>
      </div>
      {projects.length > 0 ? (
        <div className="flex w-full max-w-sm flex-col gap-1.5">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onAddObject(project)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border border-border/60 px-4 py-3 text-left transition-colors',
                'hover:border-primary/40 hover:bg-accent/40',
              )}
            >
              <Building2 className="text-muted-foreground size-4 shrink-0" />
              <span className="text-sm font-medium">{project.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">Объектов пока нет — создайте первый.</p>
      )}
      <Button type="button" variant="outline" className="gap-2" onClick={() => dialogs.openCreateProject()}>
        <Plus className="size-4" />
        Создать объект
      </Button>
      <CreateProjectSheet
        open={dialogs.createProjectOpen}
        mandatory={dialogs.createMandatory}
        onOpenChange={(open) => (open ? dialogs.openCreateProject() : dialogs.closeCreateProject())}
        onCreated={onProjectCreated}
      />
    </div>
  );
}
