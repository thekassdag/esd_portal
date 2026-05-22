import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const services = mysqlTable("services", {
  id: varchar("id", { length: 36 })
    .default(sql`(UUID())`)
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),       // e.g. "Frontend"
  description: varchar("description", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});