"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Frontend", "Backend", "Fullstack", "DevOps", "UI/UX", "Data Science", "Mobile", "QA", "Security", "Product", "Marketing", "Sales", "HR", "Finance", "Legal", "Other"];

const FilterChips = () => {
    const [activeFilter, setActiveFilter] = useState("All");
    return (
        <div className="flex flex-wrap gap-2 mb-5 animate-fade-in stagger-2">
          {FILTERS.map((f) => (
            <Button
              key={f}
              variant={activeFilter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(f)}
              className={cn(
                "h-7 text-xs font-medium rounded-full transition-all px-3.5",
                activeFilter === f
                  ? "shadow-sm shadow-primary/20"
                  : "bg-background/70 hover:bg-background text-muted-foreground hover:text-foreground border-border/60"
              )}
            >
              {f}
            </Button>
          ))}
        </div>
    );
};

export default FilterChips;