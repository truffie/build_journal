'use client';

import { Toaster } from '@/components/ui/sonner';
import type { ReactNode } from 'react';
import { AuthInitializer } from './auth-initializer';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';

type ApplicationProvidersProps = {
  readonly children: ReactNode;
};

export function ApplicationProviders({ children }: ApplicationProvidersProps): React.ReactElement {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthInitializer>
          {children}
          <Toaster richColors position="top-right" />
        </AuthInitializer>
      </ThemeProvider>
    </QueryProvider>
  );
}
