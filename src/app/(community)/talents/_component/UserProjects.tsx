"use client";
import { useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TelegramPost } from "@/components/ui/TelegramPost";
import { useProjects } from "@/app/(community)/_modules/hooks";
import { PROJECT_TYPES } from "@/lib/constants";

export function UserProjects({ userId }: { userId: string }) {
  const { projects, isLoading, isError, loadMore, hasNextPage, tag, setTag } = useProjects({ initialUserId: userId });
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastProjectElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        loadMore();
      }
    });

    if (node) observerRef.current.observe(node);
  }, [isLoading, hasNextPage, loadMore]);

  return (
    <Card className="glass-card rounded-2xl border-none shadow-md animate-fade-in">
      <CardHeader className="px-5 pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground">Projects</CardTitle>
        <div className="flex overflow-x-auto pb-2 gap-2 mt-3 -mx-1 px-1 scrollbar-hide">
          <button
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${!tag ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
            onClick={() => setTag("")}
          >
            All
          </button>
          {Object.keys(PROJECT_TYPES).map((projectTag) => (
            <button
              key={projectTag}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap capitalize ${tag === projectTag ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
              onClick={() => setTag(projectTag)}
            >
              {projectTag.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="columns-1 sm:columns-2 gap-3 [&>div]:break-inside-avoid [&>div]:mb-3">
          {projects.map((project, index) => (
            <div
              key={project.postLink}
              ref={index === projects.length - 1 ? lastProjectElementRef : null}
            >
              <TelegramPost
                postLink={project.postLink}
                header={
                  <div className="flex items-center justify-between p-3 bg-card h-[50px] border-b border-border">
                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-secondary text-secondary-foreground uppercase tracking-wider">
                      {project.tag.replace(/_/g, " ")}
                    </span>
                    <a
                      href={project.postLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      View Post
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  </div>
                }
              />
            </div>
          ))}
        </div>
        {isLoading && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Loading...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
