import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error";
import { verifyAccessToken } from "../utils/tokens";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  const cookieToken = req.cookies?.accessToken;
  const token = bearer ?? cookieToken;

  if (!token) {
    return next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      workspaceId: payload.workspaceId
    };
    return next();
  } catch {
    return next(new AppError("Invalid or expired access token", 401, "AUTH_INVALID"));
  }
}

export function requireWorkspace(req: Request, _res: Response, next: NextFunction) {
  const workspaceId = req.params.workspaceId ?? req.query.workspaceId ?? req.user?.workspaceId;
  if (!workspaceId || typeof workspaceId !== "string") {
    return next(new AppError("Workspace context required", 400, "WORKSPACE_REQUIRED"));
  }
  req.user = { ...req.user!, workspaceId };
  return next();
}
