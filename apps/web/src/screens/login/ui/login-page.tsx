'use client';

import { LoginForm } from '@/features/auth/login';

export function LoginPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <LoginForm />
    </div>
  );
}
