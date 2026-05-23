
"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";



// Page header
const PageHeader = () => {
  const pathname = usePathname();
  return (
        <div className="my-6 animate-fade-in flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">Browse Talent</h1>
            <p className="text-sm text-muted-foreground mt-1">Find the perfect match for your next project</p>
          </div>

          <div className="flex items-center bg-background border border-border px-2 py-1.5 rounded-lg gap-1">
            {[
              { label: "Talents", href: "/talents" },
              { label: "Projects", href: "/projects" },
              { label: "Podcast", href: "/podcast" },
              { label: "Legacy Wall", href: "/legacy-wall" }
            ].map(({ label, href }) => (

              <Link
                key={label}
                href={href}
                className={
                  cn(
                    "text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
                    pathname === href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
  );
};

export default PageHeader;