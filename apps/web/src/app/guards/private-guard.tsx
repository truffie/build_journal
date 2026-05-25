'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/entities/session';
import { ROUTES } from '@/shared/config/routes';
import { AuthLoadingScreen } from './auth-loading-screen';

type PrivateGuardProps = {
  readonly children: ReactNode;
};

export function PrivateGuard({ children }: PrivateGuardProps): React.ReactElement | null {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    if (!isAuthenticated) {
      router.replace(ROUTES.login);
    }
  }, [isAuthenticated, isHydrated, router]);
  if (!isHydrated) {
    return <AuthLoadingScreen />;
  }
  if (!isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}
