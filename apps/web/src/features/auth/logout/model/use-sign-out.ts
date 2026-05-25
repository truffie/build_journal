'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { ROUTES } from '@/shared/config/routes';
import { logoutRequest, useAuthStore } from '@/entities/session';

type UseSignOutOptions = {
  readonly onSuccess?: () => void;
};

export function useSignOut(options?: UseSignOutOptions) {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);
  const signOut = useCallback((): void => {
    logoutRequest().catch(() => {});
    clearSession();
    options?.onSuccess?.();
    router.replace(ROUTES.login);
  }, [clearSession, router, options]);
  return { signOut };
}
