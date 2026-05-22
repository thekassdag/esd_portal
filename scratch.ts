import { db } from "./src/db";
import { like } from "drizzle-orm";

async function test() {
  const users = await db.query.users.findMany({
    where: (users, { like }) => like(users.university.name, "%test%")
  });
  console.log(users);
}
