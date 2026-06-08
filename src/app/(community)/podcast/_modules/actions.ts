"use server";

import prisma from "@/lib/prisma";

export async function getPodcasts(
  query?: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const offset = (page - 1) * limit;
    
    const whereClause: any = {};
    if (query) {
      whereClause.guest = { contains: query };
    }

    const podcastResults = await prisma.podcast.findMany({
      where: whereClause,
      orderBy: { streamDate: 'desc' },
      take: limit + 1,
      skip: offset,
    });

    let hasNextPage = podcastResults.length > limit;

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
