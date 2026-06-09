"use client";
import { useState, useEffect, useCallback } from "react";
import { getProjects } from "../actions";
import { Project } from "../types";

export interface UseProjectsOptions {
  initialQuery?: string;
  initialUserId?: string;
  initialTag?: string;
  limit?: number;
}

export function useProjects({
  initialQuery = "",
  initialUserId = "",
  initialTag = "",
  limit = 10,
}: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [userId, setUserId] = useState(initialUserId);
  const [tag, setTag] = useState(initialTag);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(
    async (
      currentQuery: string,
      currentUserId: string,
      currentTag: string,
      currentPage: number,
      isLoadMore = false
    ) => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const response = await getProjects(
          currentQuery || undefined,
          currentUserId || undefined,
          currentTag || undefined,
          currentPage,
          limit
        );

        setProjects((prev) => {
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

  // Initial fetch and fetch on filter changes
  useEffect(() => {
    // We pass 1 as the page directly to reset it when filters change
    fetchProjects(query, userId, tag, 1, false);
  }, [query, userId, tag, fetchProjects]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasNextPage) {
      fetchProjects(query, userId, tag, page + 1, true);
    }
  }, [isLoading, hasNextPage, fetchProjects, query, userId, tag, page]);

  const refresh = useCallback(() => {
    fetchProjects(query, userId, tag, 1, false);
  }, [fetchProjects, query, userId, tag]);

  return {
    projects,
    query,
    setQuery,
    userId,
    setUserId,
    tag,
    setTag,
    page,
    hasNextPage,
    isLoading,
    isError,
    error,
    loadMore,
    refresh,
  };
}
