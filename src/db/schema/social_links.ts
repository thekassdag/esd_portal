import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";
import { users } from "./users";

export const socialLinks = mysqlTable("social_links", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  platform: varchar("platform", { length: 50 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});
