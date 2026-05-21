"use client"
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    return (
        <div className="frosted-input rounded-xl flex items-center gap-3 px-4 py-2 mb-5 shadow-sm animate-fade-in stagger-1">
            <Search size={16} className="text-muted-foreground flex-shrink-0" />
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm text-foreground outline-none ring-0 focus-visible:ring-0 placeholder-muted-foreground h-8"
                placeholder="Describe your talent needs..."
            />
            {/* <Button size="sm" className="h-8 rounded-lg text-xs font-medium shadow-sm shadow-primary/15 px-4">
          Search
        </Button> */}
        </div>
    );
};

export default SearchBar;