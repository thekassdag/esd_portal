"use client";

import { useLegacyWall } from "../_modules/hooks/useLegacyWall";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { formatDate } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRef, useCallback } from "react";

export function LegacyWallPage() {
  const { events, isLoading, hasNextPage, loadMore } = useLegacyWall({
    limit: 10,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasNextPage, loadMore]
  );

  if (isLoading && events.length === 0) {
    return (
      <div className="flex justify-center mt-20">
        <FontAwesomeIcon icon={faCircleNotch} className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex justify-center mt-10">
        <p className="text-sm text-muted-foreground">
          No events recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full max-w-6xl mx-auto pb-20">
      <div className="timeline-container">
        <VerticalTimeline lineColor="hsl(var(--border))" animate={true}>
          {events.map((event, index) => {
            const contributors = event.contributors;

            return (
              <VerticalTimelineElement
                key={event.id}
                className="vertical-timeline-element--event"
                date={formatDate(event.eventDate.toString())}
                dateClassName="text-muted-foreground font-medium"
                iconStyle={{
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: "0 0 0 4px hsl(var(--background)), inset 0 2px 0 rgba(0,0,0,0.08), 0 3px 0 4px rgba(0,0,0,0.05)",
                  width: "30px",
                  height: "30px",
                  marginLeft: "-15px",
                }}
              >
                <h3 className="vertical-timeline-element-title font-semibold text-xl leading-tight">
                  {event.title}
                </h3>
                <div className="mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {event.description}
                </div>

                {contributors && contributors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap items-center gap-2">
                    <FontAwesomeIcon icon={faUsers} className="w-3.5 h-3.5 text-muted-foreground" />
                    {contributors.map((contributor, idx) => (
                      <Link
                        key={idx}
                        href={contributor.url}
                        className="text-xs px-2 py-0.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors border border-border"
                      >
                        {contributor.name}
                      </Link>
                    ))}
                  </div>
                )}
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      </div>

      {/* Intersection observer target for infinite scroll */}
      {hasNextPage && (
        <div ref={lastElementRef} className="flex justify-center mt-12 h-10">
          {isLoading && <FontAwesomeIcon icon={faCircleNotch} className="w-6 h-6 animate-spin text-primary" />}
        </div>
      )}
    </div>
  );
}