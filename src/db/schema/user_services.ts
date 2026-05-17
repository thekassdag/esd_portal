import { mysqlTable, varchar, primaryKey, timestamp } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { services } from "./services";

export const userServices = mysqlTable(
  "user_services",
  {
    userId: varchar("user_id", { length: 36 })
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    serviceId: varchar("service_id", { length: 36 })
      .references(() => services.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.serviceId] })]
);
