import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './tw-animate.css';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
});

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
      <body className={`${geist.className} min-h-screen gradient-bg font-sans antialiased`} suppressHydrationWarning>
          {children}
      </body>
    </html>
  );
}
