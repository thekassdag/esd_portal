import { relations } from "drizzle-orm";
import {
  users,
  universities,
  departments,
  socialLinks,
  services,
  userServices,
  userProjects,
} from "./schema";

export const usersRelations = relations(users, ({ one, many }) => ({
  university: one(universities, {
    fields: [users.universityId],
    references: [universities.id],
  }),
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
  socialLinks: many(socialLinks),
  services: many(userServices),
  projects: many(userProjects),
}));

export const universitiesRelations = relations(universities, ({ many }) => ({
  users: many(users),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
  users: many(users),
}));

export const socialLinksRelations = relations(socialLinks, ({ one }) => ({
  user: one(users, {
    fields: [socialLinks.userId],
    references: [users.id],
  }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  users: many(userServices),
}));

export const userServicesRelations = relations(userServices, ({ one }) => ({
  user: one(users, {
    fields: [userServices.userId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [userServices.serviceId],
    references: [services.id],
  }),
}));

export const userProjectsRelations = relations(userProjects, ({ one }) => ({
  user: one(users, {
    fields: [userProjects.userId],
    references: [users.id],
  }),
}));
