"use client";
import { useState, useEffect, useCallback } from "react";
import { getLegacyEvents } from "../actions";
import { LegacyEvent } from "../types";

export interface UseLegacyWallOptions {
  limit?: number;
}

export function useLegacyWall({
  limit = 10,
}: UseLegacyWallOptions = {}) {
  const [events, setEvents] = useState<LegacyEvent[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(
    async (
      currentPage: number,
      isLoadMore = false
    ) => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const response = await getLegacyEvents(
          currentPage,
          limit
        );

        setEvents((prev) => {
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
    fetchEvents(1, false);
  }, [fetchEvents]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasNextPage) {
      fetchEvents(page + 1, true);
    }
  }, [isLoading, hasNextPage, fetchEvents, page]);

  const refresh = useCallback(() => {
    fetchEvents(1, false);
  }, [fetchEvents]);

  return {
    events,
    page,
    hasNextPage,
    isLoading,
    isError,
    error,
    loadMore,
    refresh,
  };
}
