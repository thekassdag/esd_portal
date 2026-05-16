import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { label: "Find Talent", to: "/" },
  { label: "Browse", to: "/browse" },
  { label: "Join Community", to: "/community" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 h-14 bg-background/60 backdrop-blur-xl border-b border-border shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-0.5 h-5 bg-primary rounded-full" />
        <span className="font-bold text-sm text-foreground tracking-tight">
          E-DC Talent Pool
        </span>
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => {
          const active =
            location.pathname === link.to ||
            (link.to === "/browse" && location.pathname.startsWith("/browse"));
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative pb-0.5",
                active
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Avatar className="size-8 ring-2 ring-primary/20">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
