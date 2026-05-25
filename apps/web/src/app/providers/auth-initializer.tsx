'use client';

import { useEffect, type ReactNode } from 'react';
import { getAccessToken, refreshRequest, useAuthStore } from '@/entities/session';
import { registerAuthApiBridge } from '@/shared/api/auth-bridge';

type AuthInitializerProps = {
  readonly children: ReactNode;
};

async function tryRefresh(): Promise<boolean> {
  const result = await refreshRequest();
  if (result) {
    useAuthStore.getState().setSession(result.accessToken, result.user);
    return true;
  }
  return false;
}

export function AuthInitializer({ children }: AuthInitializerProps): React.ReactElement {
  useEffect(() => {
    registerAuthApiBridge({
      getAccessToken,
      clearSession: () => useAuthStore.getState().clearSession(),
      tryRefresh,
    });
    tryRefresh().finally(() => {
      useAuthStore.getState().markHydrated();
    });
  }, []);
  return <>{children}</>;
}
