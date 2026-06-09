"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useUsers } from "../_modules/hooks";
import { UserCard } from "./UserCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export function TalentsPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";
    const tabId = searchParams.get("tabId") || "All";

    const { users, isLoading, hasNextPage, loadMore, setQuery, setServiceId } = useUsers({
        initialQuery: q,
        initialServiceId: tabId,
        limit: 10,
    });

    useEffect(() => {
        setQuery(q);
        setServiceId(tabId);
    }, [q, tabId, setQuery, setServiceId]);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
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
        <div>
            {/* Match count */}
            {!(isLoading && users.length === 0) && (
                <p className="text-sm text-muted-foreground mb-5 font-medium">
                    Showing <span className="text-primary font-semibold">{users.length} {users.length === 1 ? 'match' : 'matches'}</span>
                </p>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {users.map((t, i) => (
                    <UserCard 
                        key={t.id} 
                        user={t} 
                        index={i} 
                        innerRef={i === users.length - 1 ? lastElementRef : undefined}
                    />
                ))}
            </div>

            {isLoading && (
                <div className="flex justify-center mt-6 py-4">
                    <FontAwesomeIcon icon={faCircleNotch} className="w-6 h-6 animate-spin text-primary" />
                </div>
            )}
            
            {!isLoading && users.length === 0 && (
                <div className="flex justify-center mt-6">
                    <div className="text-center py-4 text-sm text-muted-foreground">
                        No talents found matching your criteria.
                    </div>
                </div>
            )}
        </div>
    );
}
