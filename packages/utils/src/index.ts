import { ZodError } from "zod";

export const TRPC_PATH = "/trpc";

export function toFieldIssues(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export function formatUnknownError(error: unknown) {
  if (error instanceof Error) {
    return {
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    };
  }

  return {
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
  };
}
