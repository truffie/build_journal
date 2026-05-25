import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OpenProjectTab = {
  readonly projectId: string;
  readonly name: string;
};

type AddProjectTabPayload = {
  readonly id: string;
  readonly name: string;
};

type WorkspaceState = {
  readonly openProjectTabs: OpenProjectTab[];
  addProjectTab: (project: AddProjectTabPayload) => void;
  closeProjectTab: (projectId: string) => void;
  renameProjectTab: (projectId: string, newName: string) => void;
  resetWorkspace: () => void;
};

const initialState = {
  openProjectTabs: [] as OpenProjectTab[],
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      ...initialState,
      addProjectTab: (project) => {
        const tab: OpenProjectTab = { projectId: project.id, name: project.name };
        const exists = get().openProjectTabs.some((item) => item.projectId === project.id);
        if (!exists) {
          set({ openProjectTabs: [...get().openProjectTabs, tab] });
        }
      },
      closeProjectTab: (projectId) => {
        set({ openProjectTabs: get().openProjectTabs.filter((t) => t.projectId !== projectId) });
      },
      renameProjectTab: (projectId, newName) => {
        set({
          openProjectTabs: get().openProjectTabs.map((t) =>
            t.projectId === projectId ? { ...t, name: newName } : t,
          ),
        });
      },
      resetWorkspace: () => set(initialState),
    }),
    {
      name: 'build_journal_workspace',
      version: 3,
      partialize: (state) => ({ openProjectTabs: state.openProjectTabs }),
    },
  ),
);
