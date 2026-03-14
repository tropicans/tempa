import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TEMPA — AI-Augmented Learning Platform',
  description:
    'Transformasi Evidence-Based melalui Proyek dan AI. Platform pembelajaran berbasis proyek untuk pengembangan kapabilitas ASN.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
