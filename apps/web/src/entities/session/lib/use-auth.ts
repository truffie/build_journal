'use client';

import { selectIsAuthenticated, useAuthStore } from '../model/auth-store';

export function useAuth() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  return {
    accessToken,
    user,
    isHydrated,
    isAuthenticated,
  };
}
