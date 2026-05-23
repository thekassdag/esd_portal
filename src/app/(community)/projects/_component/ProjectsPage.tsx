"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useProjects } from "@/app/(community)/_modules/hooks";
import { ProjectCard } from "./ProjectCard";

export function ProjectsPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const tabId = searchParams.get("tabId") || "";

  const { projects, isLoading, hasNextPage, loadMore, setQuery, setTag } =
    useProjects({
      initialQuery: q,
      initialTag: tabId,
      limit: 10,
    });

  useEffect(() => {
    setQuery(q);
    setTag(tabId);
  }, [q, tabId, setQuery, setTag]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
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

  return (
    <div>
      {/* Match count */}
      <p className="text-sm text-muted-foreground mb-5 font-medium">
        Showing{" "}
        <span className="text-primary font-semibold">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
      </p>

      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 gap-4 [&>div]:break-inside-avoid [&>div]:mb-4">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.postLink}
            project={project}
            innerRef={
              i === projects.length - 1 ? lastElementRef : undefined
            }
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center mt-6">
          <div className="text-center py-4 text-sm text-muted-foreground">
            Loading...
          </div>
        </div>
      )}

      {!isLoading && projects.length === 0 && (
        <div className="flex justify-center mt-6">
          <div className="text-center py-4 text-sm text-muted-foreground">
            No projects found matching your criteria.
          </div>
        </div>
      )}
    </div>
  );
}
