"use client"
import { Input } from "@/components/ui/input";
import { Search, TriangleAlert } from "lucide-react";
import { useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useUpdateQuery } from "@/hooks";


const SearchBar = () => {
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [showLangWarn, setShowLangWarn] = useState(false);
    const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pathname = usePathname();
    const updateQuery = useUpdateQuery();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        // Allow: ASCII printable chars (a-z, A-Z, 0-9, spaces, symbols)
        // Block: any non-ASCII character (Arabic, Amharic, Chinese, etc.)
        const sanitized = raw.replace(/[^\x00-\x7F]/g, "");

        if (sanitized !== raw) {
            // User typed a non-English character — show warning briefly
            setShowLangWarn(true);
            if (warnTimer.current) clearTimeout(warnTimer.current);
            warnTimer.current = setTimeout(() => setShowLangWarn(false), 3000);
            return;
        }

        setQuery(sanitized);
        updateQuery({ q: sanitized });
    };

    return (
        <div className="mb-5 animate-fade-in stagger-1">
            <div className="frosted-input rounded-xl flex items-center gap-3 px-4 py-2 shadow-sm">
                <Search size={16} className="text-muted-foreground flex-shrink-0" />
                <Input
                    value={query}
                    onChange={handleSearch}
                    lang="en"
                    className="flex-1 bg-transparent border-none text-sm text-foreground outline-none ring-0 focus-visible:ring-0 placeholder-muted-foreground h-8"
                    placeholder={
                        pathname === "/talents" ? "Search talents by name, headline, campus, department or service they offer" : pathname === "/podcast" ? "Search podcasts by guest name" : "Get talent that did the most similar project to your idea and collaborate or hire them"
                    }
                />
            </div>

            {/* English-only warning */}
            {showLangWarn && (
                <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs animate-fade-in">
                    <TriangleAlert size={12} className="flex-shrink-0" />
                    Only English letters are allowed. Numbers and symbols are fine.
                </div>
            )}
        </div>
    );
};

export default SearchBar;