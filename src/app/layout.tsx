import Providers from '@/providers/Providers';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Digital Soft Zone | Admin',
  description: 'Admin Dashboard for Digital Soft Zone',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} bg-background text-primary-text max-w-screen overflow-x-hidden font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
