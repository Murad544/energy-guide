import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD_HASH: z.string().min(20),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  HOSTNAME: z.string().default("localhost"),
});

export const env = EnvSchema.parse(process.env);
