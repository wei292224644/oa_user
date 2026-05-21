import { eq } from "drizzle-orm";
import { z } from "zod/v4";

import { createToken } from "@acme/auth";
import { user, UserRole } from "@acme/db/schema";

import { publicProcedure, protectedProcedure, createTRPCRouter } from "../trpc";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        phone: z.string().regex(/^1[3-9]\d{9}$/, "Invalid phone number"),
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.code !== "1234") {
        throw new Error("Invalid verification code");
      }

      let u = await ctx.db.query.user.findFirst({
        where: eq(user.phone, input.phone),
      });

      if (!u) {
        const [created] = await ctx.db
          .insert(user)
          .values({
            phone: input.phone,
            name: `User ${input.phone.slice(-4)}`,
            role: UserRole.USER,
          })
          .returning();
        u = created;
      }

      if (!u) {
        throw new Error("Failed to create user");
      }

      const token = await createToken({
        sub: u.id,
        phone: u.phone,
        role: u.role,
        name: u.name ?? null,
      });

      return {
        token,
        user: {
          id: u.id,
          phone: u.phone,
          name: u.name,
          role: u.role,
        },
      };
    }),

  logout: publicProcedure.mutation(() => {
    return { success: true };
  }),

  me: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.session.user.sub,
      phone: ctx.session.user.phone,
      name: ctx.session.user.name,
      role: ctx.session.user.role,
    };
  }),

  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
});
