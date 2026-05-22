"use server";

import { db } from "@/db";
import { users, userProjects } from "@/db/schema";
import { eq, sql } from "drizzle-orm";


export async function getUserDetailsById(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      extras: {
        totalProjects: sql<number>`(SELECT count(*) FROM user_projects WHERE user_projects.user_id = users.id)`.as("totalProjects"),
        monthProjects: sql<number>`(SELECT count(*) FROM user_projects WHERE user_projects.user_id = users.id AND user_projects.created_at >= ${startOfMonth})`.as("monthProjects"),
        yearProjects: sql<number>`(SELECT count(*) FROM user_projects WHERE user_projects.user_id = users.id AND user_projects.created_at >= ${startOfYear})`.as("yearProjects"),
      },
      with: {
        university: true,
        department: true,
        socialLinks: true,
        services: {
          with: {
            service: true,
          },
        },
      },
    });

    return user || null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details");
  }
}