import {
  mysqlTable,
  varchar,
  text,
  boolean,
  timestamp,
  int,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { universities } from "./universities";
import { departments } from "./departments";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 })
     .default(sql`(UUID())`)
    .primaryKey(),

  fullName: varchar("full_name", {
    length: 255,
  }).notNull(),

  telegramId: varchar("telegram_id", { length: 255 }).unique(),

  bio: text("bio"),
  profileImageId: varchar("profile_image_id", { length: 255 }),

  universityId: varchar("university_id", { length: 36 }).references(() => universities.id, { onDelete: "set null" }),
  departmentId: varchar("department_id", { length: 36 }).references(() => departments.id, { onDelete: "set null" }),
  graduationYear: int("graduation_year"),

  isActive: boolean("is_active").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});