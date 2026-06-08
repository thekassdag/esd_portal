"use server";

import prisma from "@/lib/prisma";

export async function getUserDetailsById(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        university: true,
        department: true,
        socialLinks: true,
        services: {
          include: {
            service: true,
          },
        },
        _count: {
          select: {
            projects: true,
          }
        }
      },
    });

    if (!user) return null;

    const monthProjects = await prisma.userProject.count({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
      }
    });

    const yearProjects = await prisma.userProject.count({
      where: {
        userId,
        createdAt: { gte: startOfYear },
      }
    });

    return {
      ...user,
      totalProjects: user._count.projects,
      monthProjects,
      yearProjects,
    };
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
    const whereClause: any = {
      isActive: true,
    };
    const offset = (page - 1) * limit;

    if (query) {
      whereClause.OR = [
        { fullName: { contains: query } },
        { headline: { contains: query } },
        { university: { name: { contains: query } } },
        { university: { shortName: { contains: query } } },
        { department: { name: { contains: query } } },
        { department: { code: { contains: query } } },
      ];
    }

    if (serviceId && serviceId !== "All") {
      whereClause.services = {
        some: {
          serviceId: serviceId
        }
      };
    }

    const usersData = await prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      skip: offset,
      include: {
        university: true,
        department: true,
      },
    });

    let hasNextPage = usersData.length > limit;
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