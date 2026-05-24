"use client"
import { usePathname } from "next/navigation";
import FilterChips from "./FilterChips";
import PageHeader from "./PageHeader";
import SearchBar from "./SearchBar";
import { Suspense } from "react";

const ExploreHeader = () => {
    const pathname = usePathname();
    const isProfileDetail = pathname.startsWith('/talents/') && pathname !== '/talents';
    return (
        <div>
            {/* on profile deatil page hide it /talents/:userId */}
            {!isProfileDetail && <PageHeader />}
            {['/talents', '/projects', '/podcast'].includes(pathname) && (
                <Suspense fallback={<div className="h-10 w-full animate-pulse bg-muted rounded-xl mb-5" />}>
                    <SearchBar />
                </Suspense>
            )}
            {['/talents', '/projects'].includes(pathname) && (
                <Suspense fallback={<div className="h-8 w-full animate-pulse bg-muted rounded-full mb-5" />}>
                    <FilterChips />
                </Suspense>
            )}
        </div>
    );
};

export default ExploreHeader;