import { mysqlTable, varchar, timestamp, primaryKey } from "drizzle-orm/mysql-core";
import { users } from "./users";

export const socialLinks = mysqlTable("social_links", {
  userId: varchar("user_id", { length: 36 })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  platform: varchar("platform", { length: 50 }).notNull(),
  username: varchar("username", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
},
(table) => ({
  pk: primaryKey({
    columns: [table.userId, table.platform],
  })
}));