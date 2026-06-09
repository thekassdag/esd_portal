"use server";

import prisma from "@/lib/prisma";
import { Contributor } from "./types";

export async function getLegacyEvents(
  page: number = 1,
  limit: number = 10
) {
  try {
    const offset = (page - 1) * limit;

    const events = await prisma.legacyWall.findMany({
      orderBy: { eventDate: 'desc' },
      take: limit + 1,
      skip: offset,
    });

    let hasNextPage = events.length > limit;

    if (hasNextPage) {
      events.pop();
    }

    // Parse contributors JSON string and serialize dates for client
    const serializedEvents = events.map((event) => {
      let contributors: Contributor[] = [];
      try {
        if (event.contributors) {
          const parsed = JSON.parse(event.contributors);
          contributors = Array.isArray(parsed) ? parsed : [];
        }
      } catch {
        contributors = [];
      }

      return {
        ...event,
        contributors,
        eventDate: event.eventDate.toISOString(),
        createdAt: event.createdAt.toISOString(),
      };
    });

    return {
      data: serializedEvents,
      page,
      hasNextPage,
    };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch legacy events");
  }
}
