"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useProjects } from "@/app/(community)/_modules/hooks";
import { ProjectCard } from "./ProjectCard";
import Masonry from "react-masonry-css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const breakpointColumnsObj = {
  default: 2,
  640: 1
};

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
      {/* Notice: query without a tab selected */}
      {q && !tabId && (
        <div className="flex items-start gap-2.5 mb-5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
          <span className="mt-0.5 text-amber-500 text-base leading-none">⚠</span>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Select a <span className="font-semibold">category tab</span> above to enable smart search and see relevance scores for your query.
          </p>
        </div>
      )}

      {/* Match count */}
      {!(isLoading && projects.length === 0) && (
        <p className="text-sm text-muted-foreground mb-5 font-medium">
          Showing{" "}
          <span className="text-primary font-semibold">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        </p>
      )}

      {projects.length > 0 && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-4"
          columnClassName="pl-4 bg-clip-padding flex flex-col gap-4"
        >
          {projects.map((project, i) => (
            <ProjectCard
              key={project.postLink || project.id}
              project={project}
              innerRef={i === projects.length - 1 ? lastElementRef : undefined}
            />
          ))}
        </Masonry>
      )}
      
      {/* Intersection observer target for infinite scroll */}
      {hasNextPage && (
        <div ref={lastElementRef} className="h-4 w-full mt-4" />
      )}

      {isLoading && (
        <div className="flex justify-center mt-6 py-4">
          <FontAwesomeIcon icon={faCircleNotch} className="w-6 h-6 animate-spin text-primary" />
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
