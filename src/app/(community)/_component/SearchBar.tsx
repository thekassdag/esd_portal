"use client"
import { Input } from "@/components/ui/input";
import { Search, TriangleAlert } from "lucide-react";
import { useState, useRef, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useUpdateQuery } from "@/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";


const SearchBar = () => {
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [showLangWarn, setShowLangWarn] = useState(false);
    const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pathname = usePathname();
    const updateQuery = useUpdateQuery();
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        // Immediately reset results when user clears the input
        if (sanitized === "") {
            startTransition(() => {
                updateQuery({ q: null });
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            startTransition(() => {
                updateQuery({ q: query });
            });
        }
    };

    return (
        <div className="mb-5 animate-fade-in stagger-1">
            <div className="frosted-input rounded-xl flex items-center gap-3 px-4 py-2 shadow-sm">
                {isPending
                    ? <FontAwesomeIcon icon={faCircleNotch} className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
                    : <Search size={16} className="text-muted-foreground flex-shrink-0" />
                }
                <Input
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
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