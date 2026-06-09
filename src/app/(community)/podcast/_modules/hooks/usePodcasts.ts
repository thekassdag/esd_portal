"use client";
import { useState, useEffect, useCallback } from "react";
import { getPodcasts } from "../actions";
import { Podcast } from "../types";

export interface UsePodcastsOptions {
  initialQuery?: string;
  limit?: number;
}

export function usePodcasts({
  initialQuery = "",
  limit = 10,
}: UsePodcastsOptions = {}) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPodcasts = useCallback(
    async (
      currentQuery: string,
      currentPage: number,
      isLoadMore = false
    ) => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const response = await getPodcasts(
          currentQuery || undefined,
          currentPage,
          limit
        );

        setPodcasts((prev) => {
          if (!isLoadMore) return response.data;
          const newItems = response.data.filter(
            (item: any) => !prev.some((p: any) => p.id === item.id)
          );
          return [...prev, ...newItems];
        });
        setHasNextPage(response.hasNextPage);
        setPage(response.page);
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchPodcasts(query, 1, false);
  }, [query, fetchPodcasts]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasNextPage) {
      fetchPodcasts(query, page + 1, true);
    }
  }, [isLoading, hasNextPage, fetchPodcasts, query, page]);

  const refresh = useCallback(() => {
    fetchPodcasts(query, 1, false);
  }, [fetchPodcasts, query]);

  return {
    podcasts,
    query,
    setQuery,
    page,
    hasNextPage,
    isLoading,
    isError,
    error,
    loadMore,
    refresh,
  };
}
