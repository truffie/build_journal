'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/entities/session';
import { ROUTES } from '@/shared/config/routes';
import { AuthLoadingScreen } from '../guards/auth-loading-screen';

export function RootRedirect(): React.ReactElement {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    router.replace(isAuthenticated ? ROUTES.workspace : ROUTES.login);
  }, [isAuthenticated, isHydrated, router]);
  return <AuthLoadingScreen />;
}
