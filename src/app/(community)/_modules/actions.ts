"use server";

import { db } from "@/db";
import { userProjects } from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { EmbeddingResult } from "./types";



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
    const conditions = [
      eq(userProjects.status, "active")
    ];
    let embeddingKeys: string[] = [];
    let scoreMap: Map<string, number> = new Map();

    const offset = (page - 1) * limit;
    let hasNextPage = false;

    const isSemantic = query && tag;

    /**
     * ======================
     * SEMANTIC SEARCH MODE
     * ======================
     */
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
      // score lookup: embeddingKey -> similarity score
      scoreMap = new Map(matches.map((m) => [m.id, m.score]));

      conditions.push(inArray(userProjects.embeddingKey, embeddingKeys));

      hasNextPage = matches.length === limit;
    }

    /**
     * ======================
     * NORMAL CONDITIONS
     * ======================
     */
    if (userId) {
      conditions.push(eq(userProjects.userId, userId));
    }

    if (tag && embeddingKeys.length === 0) {
      conditions.push(eq(userProjects.tag, tag));
    }

    /**
     * ======================
     * DB QUERY CONFIG
     * ======================
     */
    const queryConfig: any = {
      where: conditions.length ? and(...conditions) : undefined,
      orderBy: [desc(userProjects.createdAt)],
      ...(isSemantic ? {} : { limit: limit + 1, offset }),
      ...(userId ? {} : { with: { user: true } }), //include me the user details if userId is not provided cuz if not userId provided we dont know them if we know we dont need to refetch
    };

    const projects = await db.query.userProjects.findMany({
      ...queryConfig,
      columns: { postLink: true, tag: true, embeddingKey: true, user: userId ? false : true },
    });

    /**
     * ======================
     * NORMAL PAGINATION LOGIC
     * ======================
     */
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
  const services = await db.query.services.findMany({
    columns: {
      id: true,
      name: true,
      description: true,
    },
  });

  return services;
}
