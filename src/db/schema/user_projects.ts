import { mysqlTable, varchar, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const userProjects = mysqlTable("user_projects", {
  id: varchar("id", { length: 36 })
    .default(sql`(UUID())`)
    .primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  postLink: varchar("post_link", { length: 255 }).unique().notNull(),
  embeddingKey: varchar("embedding_key", { length: 255 }).unique().notNull(),
  status: mysqlEnum("status", ["active", "inactive", "flaged"]).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
