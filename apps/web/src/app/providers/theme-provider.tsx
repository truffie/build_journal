'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

type ThemeProviderProps = {
  readonly children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
