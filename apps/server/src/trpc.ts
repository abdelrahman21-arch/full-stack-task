import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import { formatUnknownError, toFieldIssues } from "@repo/utils";

const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    if (error.cause instanceof ZodError) {
      return {
        ...shape,
        data: {
          ...shape.data,
          validation: {
            code: "BAD_REQUEST",
            message: "Validation failed.",
            issues: toFieldIssues(error.cause),
          },
        },
      };
    }

    return {
      ...shape,
      data: {
        ...shape.data,
        appError: formatUnknownError(error.cause ?? error),
      },
    };
  },
});

export const createTRPCContext = () => ({});
export type TRPCContext = ReturnType<typeof createTRPCContext>;
export const router = t.router;
export const publicProcedure = t.procedure;

