import { db } from "@/db";
import { departments } from "@/db/schema";
import { asc } from "drizzle-orm";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const list = await db.select().from(departments).orderBy(asc(departments.name));
    return successResponse(list);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return errorResponse("Error fetching departments", 500);
  }
}
