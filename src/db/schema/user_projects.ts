import { mysqlTable, int, varchar, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";
import { users } from "./users";

export const userProjects = mysqlTable("user_projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  postLink: varchar("post_link", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["active", "inactive", "flaged"]).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});
