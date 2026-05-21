import type { Metadata } from 'next';
import { Navbar } from '@/app/_component';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ExploreHeader } from './_component';

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
        <div className="min-h-screen">
            <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
                <TooltipProvider>
                    <Navbar />
                    <ExploreHeader/>
                    {children}
                </TooltipProvider>
            </div>
        </div>
    );
}
