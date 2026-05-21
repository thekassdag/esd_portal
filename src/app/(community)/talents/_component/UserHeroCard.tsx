"use client"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faBehance, faTelegram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faLocationDot, faMessage, faShareNodes, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import type { User } from "../types";
import Link from "next/link";
import { SupportButton } from "@gurshaplus/sdk";

const SOCIAL_ICONS = {
  github: { icon: faGithub, label: "GitHub" },
  linkedin: { icon: faLinkedin, label: "LinkedIn" },
  behance: { icon: faBehance, label: "Behance" },
  telegram: { icon: faTelegram, label: "Telegram" },
  twitter: { icon: faXTwitter, label: "Twitter / X" },
} as const;

export function UserHeroCard({ user }: { user: User }) {
  return (
    <Card className="glass-card rounded-2xl border-none shadow-md overflow-hidden animate-fade-in">

      <CardContent className="px-6 py-4">
        <div className="flex justify-between items-center  mb-4">
          <Link href="/talents" className="text-primary hover:underline flex items-center gap-2">
            <FontAwesomeIcon icon={faArrowLeft} className="text-primary size-4" />
            Back
          </Link>
          <Button variant="link" size="sm">
            <FontAwesomeIcon icon={faShareNodes} className="text-primary size-4" />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar className="size-28 ring-4 ring-background shadow-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-foreground">{user.name}</h1>
              {/* <FontAwesomeIcon icon={faCircleCheck} className="text-primary size-4" /> */}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{user.title}</p>
            <div className="flex items-center justify-center md:justify-start gap-1.5 mt-2 text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faLocationDot} className="size-3" />
              {user.location}
            </div>

            {/* Socials */}
            <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
              {(Object.entries(SOCIAL_ICONS) as [keyof typeof SOCIAL_ICONS, typeof SOCIAL_ICONS[keyof typeof SOCIAL_ICONS]][]).map(([key, { icon, label }]) => {
                const url = user.socials[key];
                if (!url) return null;
                return (
                  <Tooltip key={key}>
                    <TooltipTrigger>
                      <a href={url} target="_blank" rel="noopener noreferrer"
                        className="size-8 rounded-full border flex items-center justify-center hover:bg-accent transition-colors">
                        <FontAwesomeIcon icon={icon} className="size-3.5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5 w-full md:w-48 shrink-0">
            <Button className="w-full gap-2 font-semibold shadow-sm shadow-primary/20" size="lg">
              Message <FontAwesomeIcon icon={faMessage} className="size-3.5" />
            </Button>
            <SupportButton label="Support Me" creator="thekassdag" variant="popup" />
          </div>

        </div>
      </CardContent>
    </Card>
  );
}