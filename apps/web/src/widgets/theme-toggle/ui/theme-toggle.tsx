'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle(): React.ReactElement {
  const { resolvedTheme, setTheme, systemTheme } = useTheme();
  const hasMounted = typeof systemTheme !== 'undefined' || typeof resolvedTheme !== 'undefined';
  if (!hasMounted) {
    return (
      <Button type="button" variant="ghost" size="icon" className="size-8" aria-label="Тема" disabled />
    );
  }
  const isDark = resolvedTheme === 'dark';
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-8"
      aria-label={isDark ? 'Светлая тема' : 'Тёмная тема'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
