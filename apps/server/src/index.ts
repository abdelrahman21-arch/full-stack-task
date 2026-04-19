import cors from "cors";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { TRPC_PATH } from "@repo/utils";
import { env } from "./env.js";
import { appRouter } from "./router.js";
import { createTRPCContext } from "./trpc.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    timestamp: new Date().toISOString(),
  });
});

app.use(
  TRPC_PATH,
  createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
    onError({ error, path }) {
      console.error(`tRPC error on ${path ?? "unknown path"}`, error);
    },
  }),
);

app.listen(env.PORT, () => {
  console.log(`tRPC server listening on http://localhost:${env.PORT}${TRPC_PATH}`);
});

