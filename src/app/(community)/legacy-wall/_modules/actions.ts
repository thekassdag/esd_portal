"use server";

import prisma from "@/lib/prisma";

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
