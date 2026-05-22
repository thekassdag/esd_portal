"use server";

import { db } from "@/db";
import { users, universities, departments, userServices } from "@/db/schema";
import { eq, sql, and, or, like, desc, inArray } from "drizzle-orm";


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

export async function getUsers(
  query?: string,
  serviceId?: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const conditions = [];
    const offset = (page - 1) * limit;

    if (query) {
      const searchTerm = `%${query}%`;
      
      const matchedUniversities = await db.query.universities.findMany({
        where: or(like(universities.name, searchTerm), like(universities.shortName, searchTerm)),
        columns: { id: true }
      });
      
      const matchedDepartments = await db.query.departments.findMany({
        where: or(like(departments.name, searchTerm), like(departments.code, searchTerm)),
        columns: { id: true }
      });

      const universityIds = matchedUniversities.map(u => u.id);
      const departmentIds = matchedDepartments.map(d => d.id);
      
      const orConditions = [
        like(users.fullName, searchTerm),
        like(users.headline, searchTerm),
      ];
      
      if (universityIds.length > 0) {
        orConditions.push(inArray(users.universityId, universityIds));
      }
      if (departmentIds.length > 0) {
        orConditions.push(inArray(users.departmentId, departmentIds));
      }
      
      conditions.push(or(...orConditions));
    }

    if (serviceId && serviceId !== "All") {
      const matchedUserServices = await db.query.userServices.findMany({
        where: eq(userServices.serviceId, serviceId),
        columns: { userId: true }
      });
      
      const matchedUserIds = matchedUserServices.map(us => us.userId);
      
      if (matchedUserIds.length > 0) {
        conditions.push(inArray(users.id, matchedUserIds));
      } else {
        conditions.push(eq(users.id, "no-match"));
      }
    }

    conditions.push(eq(users.isActive, true));

    const queryConfig: any = {
      where: conditions.length ? and(...conditions) : undefined,
      orderBy: [desc(users.createdAt)],
      limit: limit + 1,
      offset,
      with: {
        university: true,
        department: true,
      },
    };

    const usersData = await db.query.users.findMany(queryConfig);

    const hasNextPage = usersData.length > limit;
    if (hasNextPage) {
      usersData.pop();
    }

    return {
      data: usersData,
      page,
      hasNextPage,
    };
  } catch (err) {
    console.error("Error fetching users:", err);
    throw new Error("Failed to fetch users");
  }
}