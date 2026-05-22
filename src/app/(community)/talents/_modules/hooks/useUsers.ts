"use client";
import { useState, useEffect, useCallback } from "react";
import { getUsers } from "../actions";

export interface UseUsersOptions {
  initialQuery?: string;
  initialServiceId?: string;
  limit?: number;
}

export function useUsers({
  initialQuery = "",
  initialServiceId = "All",
  limit = 10,
}: UseUsersOptions = {}) {
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [serviceId, setServiceId] = useState(initialServiceId);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsersList = useCallback(
    async (
      currentQuery: string,
      currentServiceId: string,
      currentPage: number,
      isLoadMore = false
    ) => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const response = await getUsers(
          currentQuery || undefined,
          currentServiceId || undefined,
          currentPage,
          limit
        );

        setUsers((prev) =>
          isLoadMore ? [...prev, ...response.data] : response.data
        );
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
    fetchUsersList(query, serviceId, 1, false);
  }, [query, serviceId, fetchUsersList]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasNextPage) {
      fetchUsersList(query, serviceId, page + 1, true);
    }
  }, [isLoading, hasNextPage, fetchUsersList, query, serviceId, page]);

  const refresh = useCallback(() => {
    fetchUsersList(query, serviceId, 1, false);
  }, [fetchUsersList, query, serviceId]);

  return {
    users,
    query,
    setQuery,
    serviceId,
    setServiceId,
    page,
    hasNextPage,
    isLoading,
    isError,
    error,
    loadMore,
    refresh,
  };
}
