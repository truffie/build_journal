'use client';

import { Suspense, useCallback, useState } from 'react';
import { useWorkspaceStore } from '@/entities/workspace';
import { useSignOut } from '@/features/auth/logout';
import type { JournalEntry } from '@/entities';
import {
  EntriesTable,
  EntriesToolbar,
  JournalSidebar,
  MobileJournalDrawer,
  WorkspaceHeader,
} from '@/widgets';
import { useWorkspacePage } from '../model/use-workspace-page';
import { useWorkspaceDialogs } from '../model/workspace-dialogs-store';
import { WorkspaceBootstrapping } from './workspace-bootstrapping';
import { WorkspaceEmptyState } from './workspace-empty-state';
import { WorkspaceModals } from './workspace-modals';
import { WorkspaceProjectPicker } from './workspace-project-picker';

function WorkspaceContent(): React.ReactElement {
  const resetWorkspace = useWorkspaceStore((state) => state.resetWorkspace);
  const { signOut } = useSignOut({ onSuccess: resetWorkspace });
  const workspace = useWorkspacePage();
  const dialogs = useWorkspaceDialogs();
  const [mobileJournalsOpen, setMobileJournalsOpen] = useState(false);
  const activeProject = workspace.openProjectTabs.find(
    (tab) => tab.projectId === workspace.params.projectId,
  );
  const activeJournal = workspace.journals.find(
    (journal) => journal.id === workspace.params.journalId,
  );
  const hasActiveFilter = Boolean(workspace.params.fromDate || workspace.params.toDate);
  const resolvedJournalId = workspace.params.journalId;
  const handleSelectJournal = useCallback(
    (journalId: string) => {
      workspace.selectJournal(journalId);
      setMobileJournalsOpen(false);
    },
    [workspace],
  );
  const handleAddJournal = useCallback(() => {
    dialogs.openCreateJournal();
    setMobileJournalsOpen(false);
  }, [dialogs]);
  const handleEditEntry = useCallback(
    (entry: JournalEntry) => dialogs.openEntrySheet(entry),
    [dialogs],
  );
  const handleDeleteEntry = useCallback(
    (entry: JournalEntry) => dialogs.openDeleteDialog(entry.id),
    [dialogs],
  );
  const handleNewEntry = useCallback(() => dialogs.openEntrySheet(), [dialogs]);

  if (workspace.isBootstrapping) return <WorkspaceBootstrapping />;

  if (workspace.needsProjectPicker) {
    return (
      <WorkspaceProjectPicker
        projects={workspace.projects}
        onAddObject={workspace.handleAddObject}
        onProjectCreated={workspace.handleProjectCreated}
      />
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      <WorkspaceHeader
        tabs={workspace.openProjectTabs}
        activeProjectId={workspace.params.projectId}
        onSelectProject={workspace.selectProject}
        onCloseProject={workspace.handleCloseProject}
        onAddObject={dialogs.openAddObject}
        onSignOut={signOut}
        onProjectRenamed={workspace.handleProjectRenamed}
      />
      {activeProject ? (
        <MobileJournalDrawer
          open={mobileJournalsOpen}
          onOpenChange={setMobileJournalsOpen}
          projectName={activeProject.name}
          activeJournalTitle={activeJournal?.title ?? null}
          journals={workspace.journals}
          activeJournalId={workspace.params.journalId}
          isLoading={workspace.isJournalsLoading}
          onSelectJournal={handleSelectJournal}
          onAddJournal={handleAddJournal}
          onJournalTitleUpdated={workspace.invalidateJournals}
        />
      ) : null}
      <div className="flex min-h-0 flex-1">
        <JournalSidebar
          journals={workspace.journals}
          activeJournalId={workspace.params.journalId}
          isLoading={workspace.isJournalsLoading}
          onSelectJournal={handleSelectJournal}
          onAddJournal={handleAddJournal}
          onJournalTitleUpdated={workspace.invalidateJournals}
          className="hidden lg:flex"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          {activeProject && activeJournal ? (
            <>
              <EntriesToolbar
                fromDate={workspace.params.fromDate}
                toDate={workspace.params.toDate}
                minDate={workspace.entriesData?.minDate ?? null}
                maxDate={workspace.entriesData?.maxDate ?? null}
                onDateRangeChange={workspace.setDateRange}
                onResetDateRange={workspace.resetDateRange}
                onNewEntry={handleNewEntry}
              />
              <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {workspace.isEntriesLoading ? (
                  <div className="flex flex-1 items-center justify-center p-6">
                    <p className="text-muted-foreground text-sm">Загрузка…</p>
                  </div>
                ) : workspace.entriesData && workspace.entriesData.items.length > 0 ? (
                  <EntriesTable
                    data={workspace.entriesData}
                    isLoading={false}
                    sortDate={workspace.params.sortDate}
                    onToggleSortDate={workspace.toggleSortDate}
                    onPageChange={workspace.setPage}
                    onEdit={handleEditEntry}
                    onDelete={handleDeleteEntry}
                  />
                ) : hasActiveFilter ? (
                  <WorkspaceEmptyState reason="no-filter-results" onAction={workspace.resetDateRange} />
                ) : (
                  <WorkspaceEmptyState reason="empty-journal" onAction={handleNewEntry} />
                )}
              </main>
            </>
          ) : (
            <WorkspaceEmptyState
              reason={activeProject ? 'no-journal' : 'no-project'}
              onAction={activeProject ? () => setMobileJournalsOpen(true) : dialogs.openAddObject}
            />
          )}
        </div>
      </div>
      <WorkspaceModals
        projects={workspace.projects}
        openProjectIds={workspace.openProjectTabs.map((t) => t.projectId)}
        projectId={workspace.params.projectId}
        journalId={resolvedJournalId}
        onAddObject={workspace.handleAddObject}
        onProjectCreated={workspace.handleProjectCreated}
        onJournalCreated={workspace.handleJournalCreated}
      />
    </div>
  );
}

export function WorkspacePage(): React.ReactElement {
  return (
    <Suspense fallback={<WorkspaceBootstrapping />}>
      <WorkspaceContent />
    </Suspense>
  );
}
