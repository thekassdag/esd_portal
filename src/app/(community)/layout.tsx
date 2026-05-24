import type { Metadata } from 'next';
import { Navbar } from '@/components/commen';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ExploreHeader } from './_component';
import { getSubs } from './_modules/actions';

export const metadata: Metadata = {
    title: 'E-DC Talent Pool',
    description: 'Find and hire top talent.',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const subs = await getSubs();
    return (
        <div className="min-h-screen">
            <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
                <TooltipProvider>
                    <Navbar subs={subs} />
                    <ExploreHeader/>
                    {children}
                </TooltipProvider>
            </div>
        </div>
    );
}
