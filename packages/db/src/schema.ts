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

export const cases = pgTable("cases", (t) => ({
  id: t.varchar({ length: 32 }).notNull().primaryKey(),
  caseName: t.varchar({ length: 255 }).notNull(),
  caseStatus: t.varchar({ length: 20 }).notNull(),
  caseClass: t.varchar({ length: 10 }),
  caseBusiness: t.varchar({ length: 50 }),
  caseTypeStr: t.varchar({ length: 50 }),
  suitType: t.varchar({ length: 20 }),
  lawsuitType: t.varchar({ length: 20 }),
  clientName: t.varchar({ length: 255 }),
  oppositeName: t.varchar({ length: 255 }),
  thirdName: t.varchar({ length: 255 }),
  takerName: t.varchar({ length: 100 }),
  auditor: t.varchar({ length: 100 }),
  caseDate: t.timestamp({ mode: "date" }),
  settledAt: t.timestamp({ mode: "date" }),
  paymentAt: t.timestamp({ mode: "date" }),
  auditedAt: t.timestamp({ mode: "date" }),
  marginAmount: t.numeric(),
  remarks: t.text(),
  archive: t.jsonb(),
  createdAt: t.timestamp({ mode: "date" }),
  updatedAt: t.timestamp({ mode: "date" }),
}));

export const caseApprovals = pgTable("case_approvals", (t) => ({
  id: t.serial().notNull().primaryKey(),
  caseId: t.varchar({ length: 32 }).notNull(),
  type: t.integer(),
  approve: t.integer(),
  approverName: t.varchar({ length: 100 }),
  remark: t.text(),
  createdAt: t.timestamp({ mode: "date" }),
  updatedAt: t.timestamp({ mode: "date" }),
}));
