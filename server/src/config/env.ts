import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().or(z.string().regex(/^file:.+/)),
  JWT_SECRET: z.string().min(10),
  PORT: z.string().transform((val) => Number(val)).pipe(z.number().int().positive()),
  BCRYPT_SALT_ROUNDS: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().int().min(4).max(15)),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  CORS_ORIGINS: z.string().optional()
});

export interface EnvVars extends z.infer<typeof envSchema> {}

export function getEnv(): EnvVars {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Environment validation failed");
  }
  return parsed.data as EnvVars;
}
