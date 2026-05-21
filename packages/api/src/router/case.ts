import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";
import { desc, eq, count } from "drizzle-orm";
import { cases, caseApprovals } from "@acme/db/schema";
import { publicProcedure } from "../trpc";

export const caseRouter = {
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(25),
        offset: z.number().min(0).default(0),
        search: z.string().optional(),
        caseType: z.string().optional(),
        status: z.string().optional(),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      const opts = input ?? { limit: 25, offset: 0 };
      const items = await ctx.db
        .select()
        .from(cases)
        .limit(opts.limit)
        .offset(opts.offset)
        .orderBy(desc(cases.caseDate));
      const totalResult = await ctx.db.select({ count: count() }).from(cases);
      const total = totalResult[0]?.count ?? 0;
      return { items, total };
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const caseItem = await ctx.db.query.cases.findFirst({
        where: eq(cases.id, input.id),
      });
      if (!caseItem) return null;
      const approvals = await ctx.db
        .select()
        .from(caseApprovals)
        .where(eq(caseApprovals.caseId, input.id));
      return { ...caseItem, approvals };
    }),

  stats: publicProcedure.query(async ({ ctx }) => {
    const totalResult = await ctx.db.select({ count: count() }).from(cases);
    const total = totalResult[0]?.count ?? 0;

    const typeCounts = await ctx.db
      .select({ type: cases.caseTypeStr, count: count() })
      .from(cases)
      .groupBy(cases.caseTypeStr);

    const statusCounts = await ctx.db
      .select({ status: cases.caseStatus, count: count() })
      .from(cases)
      .groupBy(cases.caseStatus);

    return { total, typeCounts, statusCounts };
  }),
} satisfies TRPCRouterRecord;
