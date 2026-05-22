"use client"
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useUpdateQuery } from "@/hooks";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const pathname = usePathname();
    const updateQuery = useUpdateQuery();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        updateQuery({ q: value });
    };

    return (
        <div className="frosted-input rounded-xl flex items-center gap-3 px-4 py-2 mb-5 shadow-sm animate-fade-in stagger-1">
            <Search size={16} className="text-muted-foreground flex-shrink-0" />
            <Input
                value={query}
                onChange={handleSearch}
                className="flex-1 bg-transparent border-none text-sm text-foreground outline-none ring-0 focus-visible:ring-0 placeholder-muted-foreground h-8"
                placeholder={
                    pathname === "/talents" ? "Search talents by name,headline,campus,department or service they offer" : "Get talent that did the most simuilar project to your idea and collaborate or hire them"
                }
            />
        </div>
    );
};

export default SearchBar;