import { db } from "@/db";
import { services } from "@/db/schema";
import { asc } from "drizzle-orm";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const list = await db.select().from(services).orderBy(asc(services.name));
    return successResponse(list);
  } catch (error) {
    console.error("Error fetching services:", error);
    return errorResponse("Error fetching services", 500);
  }
}
