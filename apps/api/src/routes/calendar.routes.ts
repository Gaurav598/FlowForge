import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/async-handler";
import { Task } from "../models/task.model";

const router = Router();
router.use(requireAuth);

router.get(
  "/agenda",
  asyncHandler(async (req, res) => {
    const tasks = await Task.find({
      workspace: req.query.workspaceId,
      dueDate: { $exists: true },
      archivedAt: { $exists: false }
    })
      .sort({ dueDate: 1 })
      .limit(100);
    res.json({
      events: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        startsAt: task.startDate ?? task.dueDate,
        endsAt: task.dueDate,
        taskId: task.id,
        source: "flowforge"
      }))
    });
  })
);

router.post("/google/connect", (_req, res) => {
  res.json({ authUrl: "https://accounts.google.com/o/oauth2/v2/auth", status: "pending_credentials" });
});

export { router as calendarRouter };
