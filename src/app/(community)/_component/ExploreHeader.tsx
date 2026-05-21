"use client"
import { usePathname } from "next/navigation";
import FilterChips from "./FilterChips";
import PageHeader from "./PageHeader";
import SearchBar from "./SearchBar";

const ExploreHeader = () => {
    const pathname = usePathname();
    return (
        <div>
            {/* on profile deatil page hide it /talents/:userId */}
            {!pathname.startsWith('/talents/') && pathname === '/talents' && <PageHeader />}
            {['/talents', '/projects'].includes(pathname) && (
                <>
                    <SearchBar />
                    <FilterChips />
                </>
            )}
        </div>
    );
};

export default ExploreHeader;