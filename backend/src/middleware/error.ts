import { Prisma } from "@prisma/client";
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../env.js";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

export const notFound: ErrorRequestHandler = (err, _req, res, next) => {
  if (err) {
    next(err);
    return;
  }

  res.status(404).json({ error: "Route not found" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      issues: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "A record with this unique value already exists" });
      return;
    }

    if (err.code === "P2025") {
      res.status(404).json({ error: "Record not found" });
      return;
    }
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (env.NODE_ENV === "production") {
    console.error({
      name: err instanceof Error ? err.name : "UnknownError",
      message: err instanceof Error ? err.message : "Unhandled error"
    });
  } else {
    console.error(err);
  }
  res.status(500).json({ error: "Internal server error" });
};
