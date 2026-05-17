import { mysqlTable, varchar, timestamp, int } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const departments = mysqlTable("departments", {
  id: varchar("id", { length: 36 })
    .default(sql`(UUID())`)
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }),
  years: int("years"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});