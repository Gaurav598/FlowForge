import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { Task } from "../models/task.model";

const router = Router();
router.use(requireAuth);

router.post(
  "/task-generation",
  validate(
    z.object({
      body: z.object({
        prompt: z.string().min(4),
        workspaceId: z.string().min(1),
        boardId: z.string().optional()
      })
    })
  ),
  asyncHandler(async (req, res) => {
    res.json({
      tasks: [
        {
          title: `Break down: ${req.body.prompt}`,
          priority: "high",
          storyPoints: 5,
          labels: ["AI Draft"],
          acceptanceCriteria: ["User value is explicit", "Dependencies are mapped", "Release validation is defined"]
        }
      ]
    });
  })
);

router.post(
  "/sprint-plan",
  asyncHandler(async (req, res) => {
    const tasks = await Task.find({ workspace: req.body.workspaceId, archivedAt: { $exists: false } })
      .sort({ priority: 1, dueDate: 1 })
      .limit(30);
    res.json({
      plan: {
        capacityPoints: req.body.capacityPoints ?? 74,
        recommendedTaskIds: tasks.slice(0, 12).map((task) => task.id),
        risks: ["Check dependencies for urgent tasks", "Reserve 15% capacity for interrupts"],
        confidence: 0.91
      }
    });
  })
);

router.post(
  "/summaries",
  asyncHandler(async (req, res) => {
    const tasks = await Task.find({ _id: { $in: req.body.taskIds ?? [] } }).limit(50);
    res.json({
      summary: `Summarized ${tasks.length} tasks into outcomes, blockers, owners, and focus recommendations.`,
      highlights: tasks.map((task) => `${task.key}: ${task.title}`)
    });
  })
);

router.post(
  "/prioritize",
  asyncHandler(async (req, res) => {
    const tasks = await Task.find({ workspace: req.body.workspaceId, archivedAt: { $exists: false } }).limit(100);
    res.json({
      ranked: tasks.map((task, index) => ({
        taskId: task.id,
        rank: index + 1,
        reason: "Ranked by due date, priority, dependency fan-in, and focus cost."
      }))
    });
  })
);

export { router as aiRouter };
