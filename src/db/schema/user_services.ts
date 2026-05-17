import { mysqlTable, int, primaryKey, timestamp } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { services } from "./services";

export const userServices = mysqlTable(
  "user_services",
  {
    userId: int("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    serviceId: int("service_id")
      .references(() => services.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.serviceId] })]
);
