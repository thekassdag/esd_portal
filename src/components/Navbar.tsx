"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "src/lib/utils";
import { GitPullRequestIcon, Menu, Search, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Button } from "src/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "src/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "src/components/ui/sheet";

const navLinks = [
  { label: "Find Talent", to: "/", icon: Sparkles },
  { label: "Browse", to: "/browse", icon: Search },
  { label: "Join our community", to: "https://t.me/east_devs_community", icon: Sparkles },
];

export default function Navbar() {
  const pathname = usePathname();

  const Logo = () => (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="relative flex items-center justify-center size-7 rounded-lg bg-primary shadow-sm shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
        <span className="text-[11px] font-black text-primary-foreground tracking-tight">
          E
        </span>
      </div>
      <span className="font-display font-bold text-sm text-foreground tracking-tight">
        E-DC<span className="text-muted-foreground font-medium ml-1">Talent</span>
      </span>
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 h-14 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 text-muted-foreground hover:text-foreground"
                >
                  <Menu size={18} />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              }
            />
            <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
              <div className="p-5 border-b border-border/50">
                <Logo />
              </div>
              <div className="flex flex-col gap-0.5 p-3">
                {navLinks.map((link) => {
                  const active =
                    pathname === link.to ||
                    (link.to === "/browse" && pathname?.startsWith("/browse"));
                  const Icon = link.icon;
                  return (
                    <SheetClose
                      key={link.to}
                      render={
                        <Link
                          href={link.to}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                            active
                              ? "bg-primary/8 text-primary"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          )}
                        >
                          <Icon size={16} className={active ? "text-primary" : ""} />
                          {link.label}
                        </Link>
                      }
                    />
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Logo />
      </div>

      {/* Desktop Nav links */}
      <div className="hidden md:flex items-center">
        <NavigationMenu>
          <NavigationMenuList className="gap-0.5">
            {navLinks.map((link) => {
              const active =
                pathname === link.to ||
                (link.to === "/browse" && pathname?.startsWith("/browse"));
              return (
                <NavigationMenuItem key={link.to}>
                      <NavigationMenuLink
                        active={active}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 text-[13px]",
                          active && "text-foreground font-semibold"
                        )}
                        render={<Link href={link.to} />}
                      >
                        {link.label}
                      </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex h-8 gap-2 px-3 rounded-lg border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent hover:border-border transition-all group"
          nativeButton={false}
          render={
            <a
              href="https://github.com/dagimafro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            />
          }
        >
            <GitPullRequestIcon size={15} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              102.3k
            </span>
        </Button>
        <Avatar className="size-8 ring-1 ring-border cursor-pointer hover:ring-primary/30 transition-all">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" alt="User" />
          <AvatarFallback className="text-xs font-medium">U</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
