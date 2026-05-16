import { Link, useLocation } from "react-router-dom";
import { cn } from "src/lib/utils";
import { Menu } from "lucide-react";
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
  { label: "Find Talent", to: "/" },
  { label: "Browse", to: "/browse" },
  { label: "Join Community", to: "/community" },
];

export default function Navbar() {
  const location = useLocation();

  const Logo = () => (
    <div className="flex items-center gap-2">
      <div className="w-0.5 h-5 bg-primary rounded-full" />
      <span className="font-bold text-sm text-foreground tracking-tight">
        E-DC Talent Pool
      </span>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 h-14 bg-background/60 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9">
                <Menu size={20} />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
              <div className="p-6 border-b">
                <Logo />
              </div>
              <div className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => {
                  const active =
                    location.pathname === link.to ||
                    (link.to === "/browse" && location.pathname.startsWith("/browse"));
                  return (
                    <SheetClose asChild key={link.to}>
                      <Link
                        to={link.to}
                        className={cn(
                          "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
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
          <NavigationMenuList className="gap-1">
            {navLinks.map((link) => {
              const active =
                location.pathname === link.to ||
                (link.to === "/browse" && location.pathname.startsWith("/browse"));
              return (
                <NavigationMenuItem key={link.to}>
                  <NavigationMenuLink
                    asChild
                    active={active}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-accent/50 hover:text-primary transition-all duration-200",
                      active && "text-primary font-bold bg-primary/5"
                    )}
                  >
                    <Link to={link.to}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
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
