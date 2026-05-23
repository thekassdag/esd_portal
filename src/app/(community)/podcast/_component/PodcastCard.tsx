"use client";

import { TelegramPost } from "@/components/commen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import type { Podcast } from "../_modules/types";

interface PodcastCardProps {
  podcast: Podcast;
  innerRef?: React.Ref<HTMLDivElement>;
}

export function PodcastCard({ podcast, innerRef }: PodcastCardProps) {
  const isComingSoon = new Date(podcast.streamDate) > new Date();

  return (
    <div ref={innerRef}>
      <TelegramPost
        postLink={podcast.postLink}
        header={
          <div className="flex items-center justify-between px-3 py-2 bg-card h-[50px] border-b border-border">
            {/* Left — podcast info */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">
                  {podcast.guest}
                </span>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  · Ses {podcast.ses} Eps {podcast.eps}
                </span>
              </div>
            </div>

            {/* Right — external link & status */}
            <div className="flex items-center gap-2">
              {isComingSoon && (
                <span className="ml-1 inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-medium text-amber-500 whitespace-nowrap">
                  Coming Soon
                </span>
              )}
              <a
                href={`https://t.me/${podcast.postLink || podcast.audioLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors flex-shrink-0"
                title="Listen to audio"
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
