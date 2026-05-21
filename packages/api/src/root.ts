import { authRouter } from "./router/auth";
import { caseRouter } from "./router/case";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  case: caseRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
