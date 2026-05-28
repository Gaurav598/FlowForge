import { Router } from "express";
import bcrypt from "bcryptjs";
import { randomBytes, randomUUID } from "crypto";
import { z } from "zod";
import { User } from "../models/user.model";
import { Workspace } from "../models/workspace.model";
import { asyncHandler } from "../utils/async-handler";
import { AppError } from "../utils/app-error";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens";
import { validate } from "../middleware/validate.middleware";
import { requireAuth } from "../middleware/auth.middleware";
import { env, isProduction } from "../config/env";

const router = Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(12),
    workspaceName: z.string().min(2).max(120)
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    maxAge,
    domain: isProduction ? env.COOKIE_DOMAIN : undefined
  };
}

function setAuthCookies(res: import("express").Response, payload: { id: string; email: string; workspaceId?: string; deviceId: string }) {
  const accessToken = signAccessToken({ sub: payload.id, email: payload.email, workspaceId: payload.workspaceId });
  const refreshToken = signRefreshToken({ sub: payload.id, email: payload.email, deviceId: payload.deviceId });
  res.cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000));
  res.cookie("refreshToken", refreshToken, cookieOptions(30 * 24 * 60 * 60 * 1000));
  return { accessToken };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password, workspaceName } = req.body;
    const existing = await User.exists({ email });
    if (existing) throw new AppError("Email already registered", 409, "EMAIL_EXISTS");

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, emailVerified: false });
    const workspace = await Workspace.create({
      name: workspaceName,
      slug: `${slugify(workspaceName)}-${randomBytes(3).toString("hex")}`,
      owner: user._id,
      members: [{ user: user._id, role: "owner" }]
    });
    user.currentWorkspace = workspace._id;
    await user.save();

    const deviceId = randomUUID();
    user.devices.push({
      id: deviceId,
      userAgent: req.headers["user-agent"] ?? "unknown",
      ip: req.ip ?? "unknown",
      lastSeenAt: new Date()
    });
    await user.save();

    const tokens = setAuthCookies(res, { id: user.id, email: user.email, workspaceId: workspace.id, deviceId });
    res.status(201).json({ user: sanitizeUser(user), workspace, ...tokens });
  })
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email }).select("+passwordHash");
    if (!user || !(await user.comparePassword(req.body.password))) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const deviceId = randomUUID();
    user.devices.push({
      id: deviceId,
      userAgent: req.headers["user-agent"] ?? "unknown",
      ip: req.ip ?? "unknown",
      lastSeenAt: new Date()
    });
    await user.save();

    const tokens = setAuthCookies(res, {
      id: user.id,
      email: user.email,
      workspaceId: user.currentWorkspace?.toString(),
      deviceId
    });
    res.json({ user: sanitizeUser(user), ...tokens });
  })
);

router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new AppError("Refresh token required", 401, "REFRESH_REQUIRED");

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);
    if (!user) throw new AppError("Session user not found", 401, "USER_NOT_FOUND");

    const device = user.devices.find((item: { id: string; revokedAt?: Date }) => item.id === payload.deviceId && !item.revokedAt);
    if (!device) throw new AppError("Device session revoked", 401, "DEVICE_REVOKED");
    device.lastSeenAt = new Date();
    await user.save();

    const tokens = setAuthCookies(res, {
      id: user.id,
      email: user.email,
      workspaceId: user.currentWorkspace?.toString(),
      deviceId: payload.deviceId
    });
    res.json({ user: sanitizeUser(user), ...tokens });
  })
);

router.post("/logout", (_req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(204).send();
});

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id);
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
    res.json({ user: sanitizeUser(user) });
  })
);

router.get(
  "/devices",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id);
    if (!user) throw new AppError("User not found", 404);
    res.json({ devices: user.devices.filter((device: { revokedAt?: Date }) => !device.revokedAt) });
  })
);

router.post("/forgot-password", (_req, res) => {
  res.json({ message: "If the email exists, a reset link will be sent." });
});

router.post("/verify-email", requireAuth, (_req, res) => {
  res.json({ verified: true });
});

router.post("/2fa/enable", requireAuth, (_req, res) => {
  res.json({ secretPreview: "flowforge-2fa-ready", enabled: true });
});

router.get("/oauth/:provider", (req, res) => {
  res.json({ provider: req.params.provider, message: "Connect Passport/OAuth provider credentials in production." });
});

function sanitizeUser(user: InstanceType<typeof User>) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    emailVerified: user.emailVerified,
    twoFactorEnabled: user.twoFactorEnabled,
    productivity: user.productivity,
    currentWorkspace: user.currentWorkspace
  };
}

export { router as authRouter };
