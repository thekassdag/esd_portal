"use server";

import { db } from "@/db";
import { podcasts } from "@/db/schema";
import { and, desc, like } from "drizzle-orm";

export async function getPodcasts(
  query?: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const conditions = [];
    const offset = (page - 1) * limit;
    let hasNextPage = false;

    if (query) {
      conditions.push(like(podcasts.guest, `%${query}%`));
    }

    const queryConfig: any = {
      where: conditions.length ? and(...conditions) : undefined,
      orderBy: [desc(podcasts.streamDate)],
      limit: limit + 1,
      offset,
    };

    const podcastResults = await db.query.podcasts.findMany(queryConfig);

    hasNextPage = podcastResults.length > limit;

    if (hasNextPage) {
      podcastResults.pop();
    }

    return {
      data: podcastResults,
      page,
      hasNextPage,
    };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch podcasts");
  }
}
