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

  const isEmpty = !isLoading && projects.length === 0;
  const filtersDisabled = isEmpty || isLoading;

  return (
    <Card className="glass-card rounded-2xl border-none shadow-md animate-fade-in">
      <CardHeader className="px-5 pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground">Projects</CardTitle>
        <div className="flex overflow-x-auto pb-2 gap-2 mt-3 -mx-1 px-1 scrollbar-hide">
          <button
            disabled={filtersDisabled}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed ${!tag ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
            onClick={() => setTag("")}
          >
            All
          </button>
          {Object.keys(PROJECT_TYPES).map((projectTag) => (
            <button
              key={projectTag}
              disabled={filtersDisabled}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap capitalize disabled:opacity-40 disabled:cursor-not-allowed ${tag === projectTag ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
              onClick={() => setTag(projectTag)}
            >
              {projectTag.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
            <div className="size-16 rounded-full bg-secondary flex items-center justify-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-foreground">No projects yet</p>
            <p className="text-xs text-muted-foreground max-w-[220px]">
              This talent hasn&apos;t submitted any projects yet. Check back later!
            </p>
          </div>
        ) : (
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
        )}
        <div className="flex justify-center">
          {isLoading && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Loading...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
