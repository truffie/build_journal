import { AuthGuestGuard } from '@/app';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return <AuthGuestGuard>{children}</AuthGuestGuard>;
}
