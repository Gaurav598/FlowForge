import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { PomodoroSession } from "../models/pomodoro-session.model";
import { User } from "../models/user.model";

const router = Router();
router.use(requireAuth);

router.post(
  "/sessions",
  validate(
    z.object({
      body: z.object({
        workspaceId: z.string().min(1),
        taskId: z.string().optional(),
        mode: z.enum(["25/5", "50/10", "custom", "stopwatch"]),
        startedAt: z.string().datetime(),
        endedAt: z.string().datetime().optional(),
        focusMinutes: z.number().min(0),
        breakMinutes: z.number().min(0).default(0),
        ambientSound: z.string().optional(),
        productivityScore: z.number().min(0).max(100).default(75)
      })
    })
  ),
  asyncHandler(async (req, res) => {
    const session = await PomodoroSession.create({
      workspace: req.body.workspaceId,
      user: req.user!.id,
      task: req.body.taskId,
      mode: req.body.mode,
      startedAt: new Date(req.body.startedAt),
      endedAt: req.body.endedAt ? new Date(req.body.endedAt) : undefined,
      focusMinutes: req.body.focusMinutes,
      breakMinutes: req.body.breakMinutes,
      ambientSound: req.body.ambientSound,
      productivityScore: req.body.productivityScore
    });

    await User.findByIdAndUpdate(req.user!.id, {
      $inc: { "productivity.focusMinutes": req.body.focusMinutes },
      $max: { "productivity.focusScore": req.body.productivityScore }
    });

    req.app.get("io")?.to(`workspace:${session.workspace}`).emit("focus:session-created", { session });
    res.status(201).json({ session });
  })
);

router.get(
  "/sessions",
  asyncHandler(async (req, res) => {
    const sessions = await PomodoroSession.find({
      workspace: req.query.workspaceId,
      ...(req.query.userId ? { user: req.query.userId } : {})
    })
      .sort({ startedAt: -1 })
      .limit(100);
    res.json({ sessions });
  })
);

router.get(
  "/leaderboard",
  asyncHandler(async (req, res) => {
    const leaderboard = await PomodoroSession.aggregate([
      { $match: { workspace: req.query.workspaceId } },
      {
        $group: {
          _id: "$user",
          focusMinutes: { $sum: "$focusMinutes" },
          sessions: { $sum: 1 },
          score: { $avg: "$productivityScore" }
        }
      },
      { $sort: { score: -1, focusMinutes: -1 } },
      { $limit: 10 }
    ]);
    res.json({ leaderboard });
  })
);

export { router as pomodoroRouter };
