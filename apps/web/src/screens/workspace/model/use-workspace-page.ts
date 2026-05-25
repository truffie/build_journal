'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWorkspaceStore } from '@/entities';
import {
  useProjectsQuery,
  useJournalsQuery,
  useEntriesQuery,
  PROJECTS_QUERY_KEY,
  journalsQueryKey,
  type ProjectDashboardItem,
  type ProjectJournal,
} from '@/entities';
import { useWorkspaceParams } from './use-workspace-params';
import { useWorkspaceDialogs } from './workspace-dialogs-store';

const ENTRIES_LIMIT = 20;

export function useWorkspacePage() {
  const queryClient = useQueryClient();
  const { params, selectProject, selectJournal, setPage, setDateRange, resetDateRange, toggleSortDate } =
    useWorkspaceParams();
  const openProjectTabs = useWorkspaceStore((state) => state.openProjectTabs);
  const addProjectTab = useWorkspaceStore((state) => state.addProjectTab);
  const closeProjectTab = useWorkspaceStore((state) => state.closeProjectTab);
  const renameProjectTab = useWorkspaceStore((state) => state.renameProjectTab);
  const openAddObject = useWorkspaceDialogs((s) => s.openAddObject);
  const closeAddObject = useWorkspaceDialogs((s) => s.closeAddObject);
  const openCreateProject = useWorkspaceDialogs((s) => s.openCreateProject);
  const closeCreateProject = useWorkspaceDialogs((s) => s.closeCreateProject);
  const closeCreateJournal = useWorkspaceDialogs((s) => s.closeCreateJournal);
  const resetJournalScopedUi = useWorkspaceDialogs((s) => s.resetJournalScopedUi);
  const autoSelectJournalDoneForRef = useRef<string | null>(null);

  const { data: projects = [], isLoading: isProjectsLoading } = useProjectsQuery();
  const { data: journals = [], isLoading: isJournalsLoading } = useJournalsQuery(params.projectId);
  
  const entriesParams = useMemo(
    () => ({
      page: params.page,
      limit: ENTRIES_LIMIT,
      fromDate: params.fromDate ?? undefined,
      toDate: params.toDate ?? undefined,
      sortDate: params.sortDate,
    }),
    [params.page, params.fromDate, params.toDate, params.sortDate],
  );
  const {
    data: entriesData = null,
    isLoading: isEntriesLoading,
  } = useEntriesQuery(params.journalId, entriesParams);
  const isFirstVisit = !isProjectsLoading && openProjectTabs.length === 0;
  const hasNoProjects = !isProjectsLoading && projects.length === 0;

  useEffect(() => {
    if (isProjectsLoading) return;
    if (hasNoProjects) {
      openCreateProject(true);
      return;
    }

  }, [isProjectsLoading, hasNoProjects, isFirstVisit, projects.length, openCreateProject, openAddObject]);

  useEffect(() => {
    if (params.projectId || isProjectsLoading || openProjectTabs.length === 0) return;
    selectProject(openProjectTabs[0]!.projectId);
  }, [params.projectId, isProjectsLoading, openProjectTabs, selectProject]);

  useEffect(() => {
    if (!params.projectId || params.journalId || isJournalsLoading || journals.length === 0) return;
    if (autoSelectJournalDoneForRef.current === params.projectId) return;
    autoSelectJournalDoneForRef.current = params.projectId;
    selectJournal(journals[0]!.id);
  }, [params.projectId, params.journalId, isJournalsLoading, journals, selectJournal]);

  useEffect(() => {
    autoSelectJournalDoneForRef.current = null;
  }, [params.projectId]);

  const handleProjectCreated = useCallback(
    (project: ProjectDashboardItem): void => {
      addProjectTab(project);
      selectProject(project.id);
      closeCreateProject();
      closeAddObject();
      void queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
    [addProjectTab, selectProject, queryClient, closeCreateProject, closeAddObject],
  );

  const handleAddObject = useCallback(
    (project: ProjectDashboardItem): void => {
      addProjectTab(project);
      selectProject(project.id);
      closeAddObject();
    },
    [addProjectTab, selectProject, closeAddObject],
  );

  const handleJournalCreated = useCallback(
    (journal: ProjectJournal): void => {
      if (params.projectId) {
        void queryClient.invalidateQueries({ queryKey: journalsQueryKey(params.projectId) });
      }
      selectJournal(journal.id);
      closeCreateJournal();
    },
    [params.projectId, queryClient, selectJournal, closeCreateJournal],
  );

  const invalidateJournals = useCallback((): void => {
    if (params.projectId) {
      void queryClient.invalidateQueries({ queryKey: journalsQueryKey(params.projectId) });
    }
  }, [params.projectId, queryClient]);

  const handleProjectRenamed = useCallback(
    (projectId: string, newName: string): void => {
      renameProjectTab(projectId, newName);
      void queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
    [renameProjectTab, queryClient],
  );

  const handleCloseProject = useCallback(
    (id: string): void => {
      closeProjectTab(id);
      if (id === params.projectId) {
        const remaining = openProjectTabs.filter((t) => t.projectId !== id);
        if (remaining.length > 0) {
          selectProject(remaining[0]!.projectId);
        }
      }
    },
    [closeProjectTab, params.projectId, openProjectTabs, selectProject],
  );

  const handleSelectJournal = useCallback(
    (journalId: string): void => {
      if (journalId === params.journalId) {
        return;
      }
      resetJournalScopedUi();
      selectJournal(journalId);
    },
    [params.journalId, resetJournalScopedUi, selectJournal],
  );

  const needsProjectPicker =
    !isProjectsLoading && !hasNoProjects && openProjectTabs.length === 0 && !params.projectId;

  return {
    params,
    projects,
    journals,
    isBootstrapping: isProjectsLoading,
    isJournalsLoading,
    entriesData,
    isEntriesLoading,
    openProjectTabs,
    needsProjectPicker,
    selectProject,
    selectJournal: handleSelectJournal,
    setPage,
    setDateRange,
    resetDateRange,
    handleProjectCreated,
    handleAddObject,
    handleJournalCreated,
    invalidateJournals,
    handleProjectRenamed,
    handleCloseProject,
    toggleSortDate,
  };
}
