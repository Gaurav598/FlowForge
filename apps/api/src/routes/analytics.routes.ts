import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/async-handler";
import { Analytics } from "../models/analytics.model";
import { Task } from "../models/task.model";
import { PomodoroSession } from "../models/pomodoro-session.model";
import { getAnalyticsQueue } from "../config/queues";

const router = Router();
router.use(requireAuth);

router.get(
  "/overview",
  asyncHandler(async (req, res) => {
    const workspaceId = req.query.workspaceId;
    const [completedTasks, activeTasks, focus] = await Promise.all([
      Task.countDocuments({ workspace: workspaceId, status: "done" }),
      Task.countDocuments({ workspace: workspaceId, archivedAt: { $exists: false } }),
      PomodoroSession.aggregate([
        { $match: { workspace: workspaceId } },
        { $group: { _id: null, minutes: { $sum: "$focusMinutes" }, score: { $avg: "$productivityScore" } } }
      ])
    ]);

    res.json({
      metrics: {
        completedTasks,
        activeTasks,
        focusMinutes: focus[0]?.minutes ?? 0,
        focusScore: Math.round(focus[0]?.score ?? 0)
      }
    });
  })
);

router.get(
  "/series",
  asyncHandler(async (req, res) => {
    const series = await Analytics.find({ workspace: req.query.workspaceId }).sort({ date: 1 }).limit(90);
    res.json({ series });
  })
);

router.post(
  "/rollup",
  asyncHandler(async (req, res) => {
    const job = await getAnalyticsQueue().add("workspace-rollup", {
      workspaceId: req.body.workspaceId,
      requestedBy: req.user!.id
    });
    res.status(202).json({ jobId: job.id });
  })
);

export { router as analyticsRouter };
