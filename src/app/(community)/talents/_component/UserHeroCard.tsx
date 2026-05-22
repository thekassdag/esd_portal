"use client"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faShareNodes, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { SupportButton } from "@gurshaplus/sdk";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";

interface SocialLink {
  [platform: string]: {
    link: string;
    icon: any;
  };
}

interface User {
  fullName: string;
  headline: string;
  location: string;
  avatar: string;
  socials: SocialLink;
  tgUsername?: string
}

interface UserHeroCardProps {
  user: User;
}


export function UserHeroCard({ user }: UserHeroCardProps) {
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
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback>{user.fullName?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-foreground">{user.fullName}</h1>
              {/* <FontAwesomeIcon icon={faCircleCheck} className="text-primary size-4" /> */}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{user.headline}</p>
            <div className="flex items-center justify-center md:justify-start gap-1.5 mt-2 text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faLocationDot} className="size-3" />
              {user.location}
            </div>

            {/* Socials */}
            <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
              {Object.entries(user.socials).map(([platform, social]) => {
                const data = social;
                if(!data.icon) return null; //skip if icon is missing e.g gurshaplus doesn't have an icon and its not the place to put it
                return (
                  <Tooltip key={platform}>
                    <TooltipTrigger>
                      <a
                        href={data.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-8 rounded-full border flex items-center justify-center hover:bg-accent transition-colors"
                      >
                        <FontAwesomeIcon icon={data.icon} className="size-3.5" />
                      </a>
                    </TooltipTrigger>

                    <TooltipContent>{platform}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5 w-full md:w-56 shrink-0">
            {user.tgUsername && (
              <Link href={`https://t.me/${user.tgUsername}`} >
                <Button className="w-full gap-2 font-semibold shadow-sm shadow-primary/20" size="lg">
                  Message <FontAwesomeIcon icon={faTelegram} className="size-3.5" />
                </Button>
              </Link>
            )}
            {user.socials["gurshaplus"] && (
              <SupportButton label="Buy Me Eriteb" emoji="🍔" creator={user.socials["gurshaplus"].link} variant="popup" />
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}