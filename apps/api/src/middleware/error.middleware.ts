import type { ErrorRequestHandler } from "express";
import { MongoServerError } from "mongodb";
import { AppError } from "../utils/app-error";
import { logger } from "../config/logger";
import { env } from "../config/env";

export const notFoundHandler: ErrorRequestHandler = (err, _req, _res, next) => {
  next(err);
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const error = normalizeError(err);
  if (error.statusCode >= 500) {
    logger.error({ err }, error.message);
  }

  res.status(error.statusCode).json({
    message: error.message,
    code: error.code,
    ...(env.NODE_ENV !== "production" ? { stack: err.stack } : {})
  });
};

function normalizeError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  if (err instanceof MongoServerError && err.code === 11000) {
    return new AppError("Duplicate resource", 409, "DUPLICATE_RESOURCE");
  }
  if (err instanceof Error) return new AppError(err.message, 500, "INTERNAL_ERROR");
  return new AppError("Unexpected server error", 500, "INTERNAL_ERROR");
}
