import {
  mysqlTable,
  int,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";
import { universities } from "./universities";
import { departments } from "./departments";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),

  fullName: varchar("full_name", {
    length: 255,
  }).notNull(),

  username: varchar("username", { length: 255 }).unique(),
  telegramId: varchar("telegram_id", { length: 255 }).unique(),
  
  bio: text("bio"),
  profileImageId: varchar("profile_image_id", { length: 255 }),

  universityId: int("university_id").references(() => universities.id, { onDelete: "set null" }),
  departmentId: int("department_id").references(() => departments.id, { onDelete: "set null" }),
  graduationYear: int("graduation_year"),

  availableForWork: boolean("available_for_work").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});