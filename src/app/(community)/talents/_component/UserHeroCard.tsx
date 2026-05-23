"use client"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes, faArrowLeft, faGraduationCap, faMessage } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import { numToOrdinal } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { GurshaButton } from "@/components/commen";

interface SocialLink {
  [platform: string]: {
    link: string;
    icon: any;
  };
}


interface User {
  fullName: string;
  isTeamMember: boolean;
  headline: string;
  avatar: string;
  socials: SocialLink;
  tgUsername?: string;
  uni?: any;
  dep?: any;
  gcYear?: number;
}

interface UserHeroCardProps {
  user: User;
}


export function UserHeroCard({ user }: UserHeroCardProps) {
  const isStillStudent = user.gcYear && user.gcYear > new Date().getFullYear();
  const grade = user?.gcYear && user.dep?.years ? numToOrdinal(new Date().getFullYear() - (user.gcYear - user.dep.years)) : "";

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
              {user.isTeamMember && (
                <Tooltip>
                  <TooltipTrigger>
                    <CheckCircle2 size={20} className="text-primary flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>EDC Team Member</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{user.headline}</p>
            <div className="flex items-center justify-center md:justify-start gap-1.5 mt-2 text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faGraduationCap} className="size-3" />
              {user.gcYear ? (
                isStillStudent ? (
                  <div className="flex items-center gap-1">
                    {grade}/Yr
                    <Tooltip>
                      <TooltipTrigger className="cursor-pointer underline decoration-dotted hover:text-foreground transition-colors">{user.dep?.code}</TooltipTrigger>
                      <TooltipContent><p>{user.dep?.name}</p></TooltipContent>
                    </Tooltip>
                    Student @
                    <Tooltip>
                      <TooltipTrigger className="cursor-pointer underline decoration-dotted hover:text-foreground transition-colors">{user.uni?.shortName}</TooltipTrigger>
                      <TooltipContent><p>{user.uni?.name}</p></TooltipContent>
                    </Tooltip>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger className="cursor-pointer underline decoration-dotted hover:text-foreground transition-colors">{user.uni?.shortName}</TooltipTrigger>
                      <TooltipContent><p>{user.uni?.name}</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger className="cursor-pointer underline decoration-dotted hover:text-foreground transition-colors">{user.dep?.code}</TooltipTrigger>
                      <TooltipContent><p>{user.dep?.name}</p></TooltipContent>
                    </Tooltip>
                    Class Of {user.gcYear}
                  </div>
                )
              ) : (
                "East Side Local"
              )}
            </div>

            {/* Socials */}
            <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
              {Object.entries(user.socials).map(([platform, social]) => {
                const data = social;
                if (!data.icon) return null; //skip if icon is missing e.g gurshaplus doesn't have an icon and its not the place to put it
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
          <div className="flex justify-center md:justify-start gap-1 w-full md:w-56">
            {user.socials["gurshaplus"] && (
              <GurshaButton label="Buy Me Eriteb" creator={user.socials["gurshaplus"].link} />
            )}
            {user.tgUsername && (
              <Link href={`https://t.me/${user.tgUsername}`} >
                <Button className="font-semibold shadow-sm shadow-primary/30" size="lg">
                  <FontAwesomeIcon icon={faMessage} className="size-3.5" />
                </Button>
              </Link>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}