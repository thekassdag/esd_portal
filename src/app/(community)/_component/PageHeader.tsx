"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

const tabs = [
  {
    label: "Talents",
    href: "/talents",
    title: "Browse Talent",
    subtitle: "Find the perfect match for your next project",
  },
  {
    label: "Projects",
    href: "/projects",
    title: "Explore Projects",
    subtitle: "Find people who've done it before. Hire them, team up, or just get inspired",
  },
  {
    label: "Podcast",
    href: "/podcast",
    title: "Podcast",
    subtitle: "Listen to inspiring stories from the community",
  },
  {
    label: "Legacy Wall",
    href: "/legacy-wall",
    title: "Legacy Wall",
    subtitle: "Trace all events, contributions, and achievements of our community",
  },
];

const PageHeader = () => {
  const pathname = usePathname();
  const current = tabs.find((t) => t.href === pathname) ?? tabs[0];

  return (
    <div className="my-6 animate-fade-in flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
          {current.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{current.subtitle}</p>
      </div>

      <div className="flex items-center bg-background border border-border px-2 py-1.5 rounded-lg gap-1">
        {tabs.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className={cn(
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