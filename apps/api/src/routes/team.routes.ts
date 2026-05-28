import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/async-handler";
import { Workspace } from "../models/workspace.model";
import { PomodoroSession } from "../models/pomodoro-session.model";
import { Task } from "../models/task.model";

const router = Router();
router.use(requireAuth);

router.get(
  "/:workspaceId/members",
  asyncHandler(async (req, res) => {
    const workspace = await Workspace.findById(req.params.workspaceId).populate("members.user", "name email avatarUrl productivity");
    res.json({ members: workspace?.members ?? [] });
  })
);

router.get(
  "/:workspaceId/workload",
  asyncHandler(async (req, res) => {
    const [tasks, focus] = await Promise.all([
      Task.aggregate([
        { $match: { workspace: req.params.workspaceId, archivedAt: { $exists: false } } },
        { $unwind: "$assignees" },
        { $group: { _id: "$assignees", tasks: { $sum: 1 }, points: { $sum: "$storyPoints" } } }
      ]),
      PomodoroSession.aggregate([
        { $match: { workspace: req.params.workspaceId } },
        { $group: { _id: "$user", focusMinutes: { $sum: "$focusMinutes" } } }
      ])
    ]);
    res.json({ tasks, focus });
  })
);

export { router as teamRouter };
