import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  workspaceId?: string;
};

export function signAccessToken(payload: AccessTokenPayload) {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
    issuer: "flowforge-api",
    audience: "flowforge-web"
  };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function signRefreshToken(payload: Pick<AccessTokenPayload, "sub" | "email"> & { deviceId: string }) {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    issuer: "flowforge-api",
    audience: "flowforge-web"
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET, {
    issuer: "flowforge-api",
    audience: "flowforge-web"
  }) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET, {
    issuer: "flowforge-api",
    audience: "flowforge-web"
  }) as AccessTokenPayload & { deviceId: string };
}
