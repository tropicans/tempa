import { DM_Sans } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'TEMPA',
  description: 'TEMPA MVP application skeleton',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={dmSans.variable}>{children}</body>
    </html>
  );
}
