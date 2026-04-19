import { resolve } from "node:path";
import { config } from "dotenv";
import { z } from "zod";

config({ path: resolve(process.cwd(), "../../.env") });
config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),
  PORT: z.coerce.number().default(4000),
});

export const env = envSchema.parse(process.env);

