import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const Post = pgTable("post", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 256 }).notNull(),
  content: t.text().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const CreatePostSchema = createInsertSchema(Post, {
  title: z.string().max(256),
  content: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UserRole = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const user = pgTable("user", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  phone: t.varchar({ length: 11 }).notNull().unique(),
  name: t.varchar({ length: 256 }),
  role: t
    .varchar({ length: 20 })
    .notNull()
    .default(UserRole.USER),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const CreateUserSchema = createInsertSchema(user, {
  phone: z.string().regex(/^1[3-9]\d{9}$/, "Invalid phone number"),
  name: z.string().max(256).optional(),
  role: z.enum([UserRole.ADMIN, UserRole.USER]).optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
