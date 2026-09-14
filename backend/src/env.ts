import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  ADMIN_EMAIL: z.email().default("admin@evently.local"),
  ADMIN_PASSWORD: z.string().min(8).default("change-this-password"),
  AUTH_TOKEN_SECRET: z.string().min(16).default("evently-local-auth-token-secret"),
  AUTH_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(60 * 60 * 24 * 7),
  JSON_BODY_LIMIT: z.string().default("15mb")
}).superRefine((env, ctx) => {
  if (env.NODE_ENV !== "production") {
    return;
  }

  if (env.ADMIN_PASSWORD === "change-this-password") {
    ctx.addIssue({
      code: "custom",
      path: ["ADMIN_PASSWORD"],
      message: "ADMIN_PASSWORD must be changed in production"
    });
  }

  if (env.ADMIN_EMAIL === "admin@evently.local") {
    ctx.addIssue({
      code: "custom",
      path: ["ADMIN_EMAIL"],
      message: "ADMIN_EMAIL must be changed in production"
    });
  }

  if (env.ADMIN_PASSWORD.length < 12) {
    ctx.addIssue({
      code: "custom",
      path: ["ADMIN_PASSWORD"],
      message: "ADMIN_PASSWORD must be at least 12 characters in production"
    });
  }

  if (env.AUTH_TOKEN_SECRET === "evently-local-auth-token-secret" || env.AUTH_TOKEN_SECRET.length < 32) {
    ctx.addIssue({
      code: "custom",
      path: ["AUTH_TOKEN_SECRET"],
      message: "AUTH_TOKEN_SECRET must be a strong production secret of at least 32 characters"
    });
  }

  if (env.CORS_ORIGIN.includes("*")) {
    ctx.addIssue({
      code: "custom",
      path: ["CORS_ORIGIN"],
      message: "CORS_ORIGIN must not use wildcard origins in production"
    });
  }

  if (env.CORS_ORIGIN.includes("localhost") || env.CORS_ORIGIN.includes("127.0.0.1")) {
    ctx.addIssue({
      code: "custom",
      path: ["CORS_ORIGIN"],
      message: "CORS_ORIGIN must use production frontend origins in production"
    });
  }
});

export const env = envSchema.parse(process.env);

export const corsOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
