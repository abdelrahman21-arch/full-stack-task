import { referralRouter } from "./routers/referralRouter.js";
import { router } from "./trpc.js";

export const appRouter = router({
  referral: referralRouter,
});

export type AppRouter = typeof appRouter;

