import { db } from "@/db";
import { universities } from "@/db/schema";
import { asc } from "drizzle-orm";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const list = await db.select().from(universities).orderBy(asc(universities.name));
    return successResponse(list);
  } catch (error) {
    console.error("Error fetching universities:", error);
    return errorResponse("Error fetching universities", 500);
  }
}
