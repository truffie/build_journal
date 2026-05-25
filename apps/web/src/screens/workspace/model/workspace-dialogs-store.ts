import { create } from 'zustand';
import type { JournalEntry } from '@/entities';

type WorkspaceDialogsState = {
  addObjectOpen: boolean;
  createProjectOpen: boolean;
  createMandatory: boolean;
  createJournalOpen: boolean;
  entrySheetOpen: boolean;
  editingEntry: JournalEntry | null;
  deleteDialogOpen: boolean;
  deletingEntryId: string | null;
  openAddObject: () => void;
  closeAddObject: () => void;
  openCreateProject: (mandatory?: boolean) => void;
  closeCreateProject: () => void;
  openCreateJournal: () => void;
  closeCreateJournal: () => void;
  openEntrySheet: (entry?: JournalEntry | null) => void;
  closeEntrySheet: () => void;
  openDeleteDialog: (entryId: string) => void;
  closeDeleteDialog: () => void;
  resetJournalScopedUi: () => void;
};

export const useWorkspaceDialogs = create<WorkspaceDialogsState>((set) => ({
  addObjectOpen: false,
  createProjectOpen: false,
  createMandatory: false,
  createJournalOpen: false,
  entrySheetOpen: false,
  editingEntry: null,
  deleteDialogOpen: false,
  deletingEntryId: null,
  openAddObject: () => set({ addObjectOpen: true }),
  closeAddObject: () => set({ addObjectOpen: false }),
  openCreateProject: (mandatory = false) => set({ createProjectOpen: true, createMandatory: mandatory }),
  closeCreateProject: () => set({ createProjectOpen: false, createMandatory: false }),
  openCreateJournal: () => set({ createJournalOpen: true }),
  closeCreateJournal: () => set({ createJournalOpen: false }),
  openEntrySheet: (entry = null) => set({ entrySheetOpen: true, editingEntry: entry }),
  closeEntrySheet: () => set({ entrySheetOpen: false, editingEntry: null }),
  openDeleteDialog: (entryId) => set({ deleteDialogOpen: true, deletingEntryId: entryId }),
  closeDeleteDialog: () => set({ deleteDialogOpen: false, deletingEntryId: null }),
  resetJournalScopedUi: () =>
    set({
      entrySheetOpen: false,
      editingEntry: null,
      deleteDialogOpen: false,
      deletingEntryId: null,
    }),
}));
