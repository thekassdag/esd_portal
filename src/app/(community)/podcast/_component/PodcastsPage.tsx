"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { usePodcasts } from "../_modules/hooks/usePodcasts";
import { PodcastCard } from "./PodcastCard";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 2,
  640: 1
};

export function PodcastsPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const { podcasts, isLoading, hasNextPage, loadMore, setQuery } =
    usePodcasts({
      initialQuery: q,
      limit: 10,
    });

  useEffect(() => {
    setQuery(q);
  }, [q, setQuery]);

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
          {podcasts.length} {podcasts.length === 1 ? "podcast" : "podcasts"}
        </span>
      </p>

      {podcasts.length > 0 && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-4"
          columnClassName="pl-4 bg-clip-padding flex flex-col gap-4"
        >
          {podcasts.map((podcast, i) => (
            <PodcastCard
              key={podcast.id}
              podcast={podcast}
              innerRef={i === podcasts.length - 1 ? lastElementRef : undefined}
            />
          ))}
        </Masonry>
      )}
      
      {/* Intersection observer target for infinite scroll */}
      {hasNextPage && (
        <div ref={lastElementRef} className="h-4 w-full mt-4" />
      )}

      {isLoading && (
        <div className="flex justify-center mt-6">
          <div className="text-center py-4 text-sm text-muted-foreground">
            Loading...
          </div>
        </div>
      )}

      {!isLoading && podcasts.length === 0 && (
        <div className="flex justify-center mt-6">
          <div className="text-center py-4 text-sm text-muted-foreground">
            No podcasts found matching your criteria.
          </div>
        </div>
      )}
    </div>
  );
}
