import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@fontsource-variable/geist';
import './tw-animate.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-DC Talent Pool',
  description: 'Find and hire top talent.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen gradient-bg font-sans antialiased`} suppressHydrationWarning>
          {children}
      </body>
    </html>
  );
}
