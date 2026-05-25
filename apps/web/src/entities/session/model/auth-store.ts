import { create } from 'zustand';
import type { AuthUser } from './session.types';

type AuthState = {
  readonly accessToken: string | null;
  readonly user: AuthUser | null;
  readonly isHydrated: boolean;
  readonly setSession: (accessToken: string, user: AuthUser) => void;
  readonly setAccessToken: (accessToken: string) => void;
  readonly clearSession: () => void;
  readonly markHydrated: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isHydrated: false,
  setSession: (accessToken, user) => {
    set({ accessToken, user });
  },
  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
  clearSession: () => {
    set({ accessToken: null, user: null });
  },
  markHydrated: () => {
    set({ isHydrated: true });
  },
}));

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

export function selectIsAuthenticated(state: AuthState): boolean {
  return Boolean(state.accessToken && state.user);
}
