import { PrivateGuard } from '@/app';

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return <PrivateGuard>{children}</PrivateGuard>;
}
