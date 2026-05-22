"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { fetchServices } from "../_modules/actions";
import { PROJECT_TYPES } from "@/lib/constants";
import { useUpdateQuery } from "@/hooks";
import { useSearchParams } from "next/navigation";


const FilterChips = () => {
  const [fillters, setFillters] = useState<{ id: string, name: string, description?: string | null }[]>([]);
  const updateQuery = useUpdateQuery();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(searchParams.get("tabId"));

  useEffect(() => {
    const loadFilters = async () => {
      switch (pathname) {
        case "/talents":
          const services = await fetchServices();
          setFillters([{ id: "All", name: "All" }, ...services])
          break;
        case "/projects":
          setFillters(Object.entries(PROJECT_TYPES).map(([id, description]) => ({ id, name: id.replace("_", " "), description })))
          break;
        default:
          break;
      }
    };
    loadFilters();
  }, [pathname]);

  const handleFilterClick = (filterId: string) => {
    updateQuery({ tabId: filterId });
    setActiveFilter(filterId);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-5 animate-fade-in stagger-2">
      {fillters.map((f) => (
        <Button
          key={f.id}
          variant={activeFilter === f.id ? "default" : "outline"}
          size="sm"
          onClick={() => handleFilterClick(f.id)}
          className={cn(
            "h-7 text-xs font-medium rounded-full transition-all px-3.5",
            activeFilter === f.id
              ? "shadow-sm shadow-primary/20"
              : "bg-background/70 hover:bg-background text-muted-foreground hover:text-foreground border-border/60"
          )}
        >
          {f.name}
        </Button>
      ))}
    </div>
  );
};

export default FilterChips;