"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TelegramPost } from "@/components/commen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

interface ProjectCardProps {
  project: any;
  innerRef?: React.Ref<HTMLDivElement>;
}

export function ProjectCard({ project, innerRef }: ProjectCardProps) {
  const user = project.user;
  const userName = user?.fullName || "Unknown";
  const avatar = user?.profileImageId
    ? `${process.env.NEXT_PUBLIC_APP_URL}/files/${user.profileImageId}`
    : `https://ui-avatars.com/api/?name=${userName}`;

  return (
    <div ref={innerRef}>
      <TelegramPost
        postLink={project.postLink}
        header={
          <div className="flex items-center justify-between px-3 py-2 bg-card h-[50px] border-b border-border">
            {/* Left — user info (Twitter-like) */}
            <Link
              href={`/talents/${user?.id}`}
              className="flex items-center gap-2 min-w-0 group"
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar className="size-7 ring-1 ring-border shadow-sm">
                <AvatarImage src={avatar} alt={userName} />
                <AvatarFallback className="text-[10px]">
                  {userName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-baseline  gap-1.5 min-w-0">
                <span className="text-xs font-semibold text-foreground truncate group-hover:underline">
                  {userName}
                </span>
                <span className="text-[10px] text-muted-foreground capitalize whitespace-nowrap">
                  · {project.tag.replace(/_/g, " ")}
                </span>
              </div>
            </Link>

            {/* Right — external link */}
            <div className="flex items-center gap-2">
              {project.score != null && (
                  <span className="ml-1 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary whitespace-nowrap">
                    {Math.round(project.score * 100)}% match
                  </span>
                )}
            <a
              href={`https://t.me/${project.postLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors flex-shrink-0"
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="size-3" />
            </a>
            </div>
          </div>
        }
      />
    </div>
  );
}
