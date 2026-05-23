/**
 * Podcast schema
 *
 * ses         - session number
 * eps         - episode number
 * post_link   - embedded Telegram podcast post
 * audio_link  - Telegram audio post in our channel
 * guest       - guest name
 * stream_date - stream date
 */

import { mysqlTable, varchar, int, date } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const podcasts = mysqlTable("podcasts", {
  id: varchar("id", { length: 36 })
    .default(sql`(UUID())`)
    .primaryKey(),
  ses: int("ses").notNull(),
  eps: int("eps").notNull(),
  postLink: varchar("post_link", { length: 255 }).unique().notNull(),
  audioLink: varchar("audio_link", { length: 255 }).unique(),
  guest: varchar("guest", { length: 255 }).notNull(),
  streamDate: date("stream_date").notNull(),
});
