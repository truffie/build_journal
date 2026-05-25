'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/widgets/theme-toggle';

type WorkspaceActionsProps = {
  readonly onSignOut: () => void;
};

export function WorkspaceActions({ onSignOut }: WorkspaceActionsProps): React.ReactElement {
  return (
    <div className="flex items-center gap-1">
      <ThemeToggle />
      <Button type="button" variant="ghost" size="icon" className="size-7" onClick={onSignOut} aria-label="Выйти">
        <LogOut className="size-3.5" />
      </Button>
    </div>
  );
}
