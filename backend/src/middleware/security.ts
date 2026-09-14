import type { NextFunction, Request, Response } from "express";
import { AppError } from "./error.js";

const WINDOW_MS = 60_000;
const MAX_AUTH_REQUESTS = 20;
const authAttempts = new Map<string, { count: number; resetAt: number }>();

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.setHeader("Cache-Control", "no-store");

  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  next();
}

export function authRateLimiter(req: Request, _res: Response, next: NextFunction) {
  if (!isAuthSensitiveRoute(req)) {
    next();
    return;
  }

  const now = Date.now();
  const key = `${req.ip}:${req.method}:${req.path}`;
  const current = authAttempts.get(key);

  if (!current || current.resetAt <= now) {
    authAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  current.count += 1;

  if (current.count > MAX_AUTH_REQUESTS) {
    next(new AppError("Too many attempts. Please try again shortly.", 429));
    return;
  }

  next();
}

function isAuthSensitiveRoute(req: Request) {
  if (req.method !== "POST" && req.method !== "PATCH") {
    return false;
  }

  return (
    req.path.includes("/login") ||
    req.path.includes("/signup") ||
    req.path.includes("/password") ||
    req.path.includes("/admin/login")
  );
}
