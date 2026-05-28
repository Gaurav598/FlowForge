import { Router } from "express";
import { randomBytes } from "crypto";
import { z } from "zod";
import { requireAuth, requireWorkspace } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { Workspace } from "../models/workspace.model";
import { AppError } from "../utils/app-error";

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const workspaces = await Workspace.find({ "members.user": req.user!.id }).sort({ updatedAt: -1 });
    res.json({ workspaces });
  })
);

router.post(
  "/",
  validate(
    z.object({
      body: z.object({
        name: z.string().min(2).max(120)
      })
    })
  ),
  asyncHandler(async (req, res) => {
    const slug = `${req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${randomBytes(3).toString("hex")}`;
    const workspace = await Workspace.create({
      name: req.body.name,
      slug,
      owner: req.user!.id,
      members: [{ user: req.user!.id, role: "owner" }]
    });
    res.status(201).json({ workspace });
  })
);

router.post(
  "/:workspaceId/invites",
  requireWorkspace,
  validate(
    z.object({
      body: z.object({
        email: z.string().email(),
        role: z.enum(["admin", "lead", "member", "guest"]).default("member")
      }),
      params: z.object({ workspaceId: z.string().min(1) })
    })
  ),
  asyncHandler(async (req, res) => {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) throw new AppError("Workspace not found", 404);

    workspace.invites.push({
      email: req.body.email,
      role: req.body.role,
      tokenHash: randomBytes(32).toString("hex"),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await workspace.save();
    res.status(201).json({ invite: workspace.invites.at(-1) });
  })
);

router.patch(
  "/:workspaceId/settings",
  requireWorkspace,
  validate(
    z.object({
      body: z.object({
        sprintLengthDays: z.number().min(1).max(30).optional(),
        defaultFocusMode: z.enum(["25/5", "50/10", "custom"]).optional(),
        aiPlanningEnabled: z.boolean().optional(),
        calendarSyncEnabled: z.boolean().optional()
      }),
      params: z.object({ workspaceId: z.string().min(1) })
    })
  ),
  asyncHandler(async (req, res) => {
    const workspace = await Workspace.findByIdAndUpdate(
      req.params.workspaceId,
      { $set: Object.fromEntries(Object.entries(req.body).map(([key, value]) => [`settings.${key}`, value])) },
      { new: true }
    );
    if (!workspace) throw new AppError("Workspace not found", 404);
    res.json({ workspace });
  })
);

export { router as workspaceRouter };
