'use client';

import { AddObjectSheet } from '@/features/project/select-project';
import { CreateJournalSheet } from '@/features/journal/create-journal';
import { CreateProjectSheet } from '@/features/project/create-project';
import { EntryFormSheet } from '@/features/journal/create-entry';
import { DeleteEntryDialog } from '@/features/journal/delete-entry';
import type { ProjectDashboardItem, ProjectJournal } from '@/entities';
import { useWorkspaceDialogs } from '../model/workspace-dialogs-store';

type WorkspaceModalsProps = {
  readonly projects: ProjectDashboardItem[];
  readonly openProjectIds: string[];
  readonly projectId: string | null;
  readonly journalId: string | null;
  readonly onAddObject: (project: ProjectDashboardItem) => void;
  readonly onProjectCreated: (project: ProjectDashboardItem) => void;
  readonly onJournalCreated: (journal: ProjectJournal) => void;
};

export function WorkspaceModals({
  projects,
  openProjectIds,
  projectId,
  journalId,
  onAddObject,
  onProjectCreated,
  onJournalCreated,
}: WorkspaceModalsProps): React.ReactElement {
  const dialogs = useWorkspaceDialogs();
  const handleOpenCreateProject = (): void => {
    dialogs.closeAddObject();
    dialogs.openCreateProject();
  };
  return (
    <>
      <AddObjectSheet
        open={dialogs.addObjectOpen}
        onOpenChange={(open) => (open ? dialogs.openAddObject() : dialogs.closeAddObject())}
        projects={projects}
        openProjectIds={openProjectIds}
        onSelect={onAddObject}
        onCreateNew={handleOpenCreateProject}
      />
      {projectId ? (
        <CreateJournalSheet
          open={dialogs.createJournalOpen}
          onOpenChange={(open) => (open ? dialogs.openCreateJournal() : dialogs.closeCreateJournal())}
          projectId={projectId}
          onCreated={onJournalCreated}
        />
      ) : null}
      <CreateProjectSheet
        open={dialogs.createProjectOpen}
        mandatory={dialogs.createMandatory}
        onOpenChange={(open) => (open ? dialogs.openCreateProject() : dialogs.closeCreateProject())}
        onCreated={onProjectCreated}
      />
      {journalId ? (
        <EntryFormSheet
          open={dialogs.entrySheetOpen}
          onOpenChange={(open) => (open ? undefined : dialogs.closeEntrySheet())}
          journalId={journalId}
          entry={dialogs.editingEntry}
          onSuccess={() => {}}
        />
      ) : null}
      {journalId ? (
        <DeleteEntryDialog
          open={dialogs.deleteDialogOpen}
          onOpenChange={(open) => (open ? undefined : dialogs.closeDeleteDialog())}
          journalId={journalId}
          entryId={dialogs.deletingEntryId}
        />
      ) : null}
    </>
  );
}
