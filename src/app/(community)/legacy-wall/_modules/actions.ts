"use server";

import { db } from "@/db";
import { legacyWall } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getLegacyEvents(
  page: number = 1,
  limit: number = 10
) {
  try {
    const offset = (page - 1) * limit;
    let hasNextPage = false;

    const queryConfig: any = {
      orderBy: [desc(legacyWall.eventDate)],
      limit: limit + 1,
      offset,
    };

    const events = await db.query.legacyWall.findMany(queryConfig);

    hasNextPage = events.length > limit;

    if (hasNextPage) {
      events.pop();
    }

    return {
      data: events,
      page,
      hasNextPage,
    };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch legacy events");
  }
}
