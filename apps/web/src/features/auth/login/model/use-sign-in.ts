'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ROUTES } from '@/shared/config/routes';
import { loginRequest, useAuthStore } from '@/entities/session';

type SignInCredentials = {
  readonly email: string;
  readonly password: string;
};

type UseSignInOptions = {
  readonly onSuccess?: () => void;
};

export function useSignIn(options?: UseSignInOptions) {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signIn = useCallback(
    async (credentials: SignInCredentials): Promise<void> => {
      setIsPending(true);
      setError(null);
      try {
        const result = await loginRequest(credentials);
        setSession(result.accessToken, result.user);
        options?.onSuccess?.();
        router.replace(ROUTES.workspace);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Ошибка входа';
        setError(message);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [router, setSession, options],
  );
  const clearError = useCallback((): void => {
    setError(null);
  }, []);
  return { signIn, isPending, error, clearError };
}
