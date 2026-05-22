"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Star, Briefcase, MapPin } from "lucide-react";
import { capitalizeFirst, cn, numToOrdinal } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";

export function UserCard({ user, index, innerRef }: { user: any; index: number, innerRef?: React.Ref<HTMLDivElement> }) {
    const router = useRouter();

    const name = capitalizeFirst(user.fullName);
    const title = user.headline || "---";
    const skills = user.services?.map((s: any) => s.service.name) || [];
    const avatar = user.profileImageId ? `${process.env.NEXT_PUBLIC_APP_URL}/files/${user.profileImageId}` : `https://ui-avatars.com/api/?name=${user.fullName}`;

    const isStillStudent = user.graduationYear && user.graduationYear > new Date().getFullYear();
    // Assuming department.years exists on user.department
    const grade = (user.graduationYear && user.department?.years)
        ? numToOrdinal(new Date().getFullYear() - (user.graduationYear - user.department.years))
        : "";

    return (
        <Card
            ref={innerRef}
            className={cn(
                "talent-card glass-card rounded-xl cursor-pointer border-border/50 animate-fade-in",
                `stagger-${index + 1}`
            )}
            onClick={() => router.push(`/talents/${user.id}`)}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="size-11 ring-1 ring-border shadow-sm">
                        <AvatarImage src={avatar} alt={name} />
                        <AvatarFallback className="text-xs">{name[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-sm text-foreground truncate">{name}</span>
                            {user.isTeamMember && (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <CheckCircle2 size={13} className="text-primary flex-shrink-0" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>EDC Team Member</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{title}</p>

                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-muted-foreground truncate">
                            <FontAwesomeIcon icon={faGraduationCap} className="size-3" />
                            {user.graduationYear ? (
                                isStillStudent ? (
                                    <div className="flex items-center gap-1 truncate">
                                        <TooltipProvider>
                                            {grade}/Yr
                                            <Tooltip>
                                                <TooltipTrigger className="cursor-pointer underline decoration-dotted hover:text-foreground transition-colors ml-1">{user.department?.code}</TooltipTrigger>
                                                <TooltipContent><p>{user.department?.name}</p></TooltipContent>
                                            </Tooltip>
                                            <span className="ml-1">Student @</span>
                                            <Tooltip>
                                                <TooltipTrigger className="cursor-pointer underline decoration-dotted hover:text-foreground transition-colors ml-1 truncate max-w-[80px] block">{user.university?.shortName || user.university?.name}</TooltipTrigger>
                                                <TooltipContent><p>{user.university?.name}</p></TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 truncate">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger className="cursor-pointer underline decoration-dotted hover:text-foreground transition-colors truncate max-w-[80px] block">{user.university?.shortName || user.university?.name}</TooltipTrigger>
                                                <TooltipContent><p>{user.university?.name}</p></TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger className="cursor-pointer underline decoration-dotted hover:text-foreground transition-colors ml-1">{user.department?.code}</TooltipTrigger>
                                                <TooltipContent><p>{user.department?.name}</p></TooltipContent>
                                            </Tooltip>
                                            <span className="ml-1 whitespace-nowrap">Class Of {user.graduationYear}</span>
                                        </TooltipProvider>
                                    </div>
                                )
                            ) : (
                                <span>East Side Local</span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
