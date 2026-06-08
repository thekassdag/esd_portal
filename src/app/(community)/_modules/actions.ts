"use server";

import prisma from "@/lib/prisma";
import { EmbeddingResult } from "./types";
import bot from "@/lib/telegram-bot";
import { formatCount } from "@/lib/utils";

export async function getSubs() {
  try {
    const subs = await bot.api.getChatMemberCount(process.env.EDC_CHANNEL_USERNAME!)
    return formatCount(subs);
  } catch (error) {
    console.error("Error getting subscriptions:", error);
    return "**.*";
  }
}

async function searchEmbeddings(
  query: string,
  tag: string,
  page: number,
  limit: number
): Promise<EmbeddingResult[]> {
  const params = new URLSearchParams({
    query,
    tag,
    page: page.toString(),
    match_count: limit.toString(),
  });

  const res = await fetch(
    `${process.env.SUPABASE_URL}/functions/v1/search-embedings?${params}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BACKEND_TO_SUPABASE_API_KEY}`,
      },
    }
  );

  if (!res.ok) throw new Error("Embedding search failed");

  const data = await res.json();

  return data?.results;
}

export async function getProjects(
  query?: string,
  userId?: string,
  tag?: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const whereClause: any = {
      status: "active"
    };

    let embeddingKeys: string[] = [];
    let scoreMap: Map<string, number> = new Map();

    const offset = (page - 1) * limit;
    let hasNextPage = false;

    const isSemantic = query && tag;

    if (isSemantic) {
      const matches = await searchEmbeddings(query, tag, page, limit);

      if (!matches.length) {
        return {
          data: [],
          page,
          hasNextPage: false,
        };
      }

      embeddingKeys = matches.map((m) => m.id);
      scoreMap = new Map(matches.map((m) => [m.id, m.score]));

      whereClause.embeddingKey = { in: embeddingKeys };

      hasNextPage = matches.length === limit;
    }

    if (userId) {
      whereClause.userId = userId;
    }

    if (tag && embeddingKeys.length === 0) {
      whereClause.tag = tag;
    }

    const projects = await prisma.userProject.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      ...(isSemantic ? {} : { take: limit + 1, skip: offset }),
      select: { 
        id: true,
        postLink: true, 
        tag: true, 
        embeddingKey: true, 
        user: userId ? false : true 
      },
    });

    if (!isSemantic) {
      hasNextPage = projects.length > limit;

      if (hasNextPage) {
        projects.pop();
      }
    }

    return {
      data: projects.map((p) => ({ ...p, score: scoreMap.get(p.embeddingKey) ?? null })),
      page,
      hasNextPage,
    };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch projects");
  }
}

export async function fetchServices() {
  const services = await prisma.service.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return services;
}
