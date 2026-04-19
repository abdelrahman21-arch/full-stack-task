"use client";

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@repo/server/router";

export const trpc = createTRPCReact<AppRouter>();
