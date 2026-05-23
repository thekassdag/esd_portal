import { mysqlTable, varchar, text, timestamp, json } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const legacyWall = mysqlTable("legacy_wall", {
  id: varchar("id", { length: 36 })
    .default(sql`(UUID())`)
    .primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  eventDate: timestamp("event_date").notNull(),
  contributors: json("contributors").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});