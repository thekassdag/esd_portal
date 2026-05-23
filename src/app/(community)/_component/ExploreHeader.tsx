"use client"
import { usePathname } from "next/navigation";
import FilterChips from "./FilterChips";
import PageHeader from "./PageHeader";
import SearchBar from "./SearchBar";

const ExploreHeader = () => {
    const pathname = usePathname();
    const isProfileDetail = pathname.startsWith('/talents/') && pathname !== '/talents';
    return (
        <div>
            {/* on profile deatil page hide it /talents/:userId */}
            {!isProfileDetail && <PageHeader />}
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