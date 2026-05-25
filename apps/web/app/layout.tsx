import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ApplicationProviders } from '@/app';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Журнал работ',
  description: 'Строительный журнал работ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background font-sans text-foreground">
        <ApplicationProviders>{children}</ApplicationProviders>
      </body>
    </html>
  );
}
