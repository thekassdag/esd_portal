"use client";

import Link from "next/link";
import { Avatar, AvatarImage } from "src/components/ui/avatar";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDollarToSlot } from "@fortawesome/free-solid-svg-icons";
import GurshaButton from "./GurshaButton";


export default function Navbar() {
  const pathname = usePathname();
  const isTalentPage = pathname !== "/talents" && pathname.startsWith("/talents/");

  const Logo = () => (
    <div className="flex items-center gap-3 group">
      <Link href="/">
        <Avatar className="size-14 ring-1 ring-primary/20 shadow-sm p-1">
          <AvatarImage src="/logo.jpg" alt="East Devs Community" className="rounded-full" />
        </Avatar>
      </Link>
      <div className="flex flex-col">
        <span className="font-display font-bold text-md text-foreground tracking-tight">
          East Devs Community
        </span>
        <div className="flex items-center gap-3 mt-0.5">
          <a href="https://t.me/east_devs_community" className="text-sm text-primary underline">
            Join Us
          </a>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">2.5k Sub</span>
        </div>
      </div>
    </div>
  );

  return (
    <nav className="max-w-4xl mx-auto flex items-center justify-between px-0 h-14 mt-2 mb-4 ">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <Logo />
      </div>

      {/* support button (hide on talents detail page) */}
      {!isTalentPage && (
        <GurshaButton
          label="Dontate"
          creator="thekassdag"
        />
      )}
    </nav>
  );
}
