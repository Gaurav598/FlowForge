import type { NextFunction, Request, Response } from "express";
import type { ZodError, ZodType } from "zod";
import { AppError } from "../utils/app-error";

type ParsedRequest = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
};

export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      }) as ParsedRequest;
      req.body = parsed.body ?? req.body;
      req.query = (parsed.query ?? req.query) as Request["query"];
      req.params = (parsed.params ?? req.params) as Request["params"];
      next();
    } catch (error) {
      const zodError = error as ZodError;
      next(new AppError(zodError.issues?.[0]?.message ?? "Invalid request", 422, "VALIDATION_ERROR"));
    }
  };
}
