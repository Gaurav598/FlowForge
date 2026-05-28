import { Router } from "express";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { Task } from "../models/task.model";
import { Comment } from "../models/comment.model";
import { ActivityLog } from "../models/activity-log.model";
import { Notification } from "../models/notification.model";
import { AppError } from "../utils/app-error";
import { getReminderQueue } from "../config/queues";

const router = Router();
router.use(requireAuth);

const createTaskSchema = z.object({
  body: z.object({
    workspaceId: z.string().min(1),
    boardId: z.string().min(1),
    key: z.string().min(2),
    title: z.string().min(2).max(180),
    description: z.string().max(8000).optional(),
    status: z.string().default("backlog"),
    priority: z.enum(["urgent", "high", "medium", "low"]).default("medium"),
    labels: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    assignees: z.array(z.string()).default([]),
    storyPoints: z.number().default(0),
    dueDate: z.string().datetime().optional()
  })
});

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter = {
      workspace: req.query.workspaceId,
      ...(req.query.boardId ? { board: req.query.boardId } : {}),
      ...(req.query.status ? { status: req.query.status } : {}),
      archivedAt: { $exists: false }
    };
    const tasks = await Task.find(filter).sort({ position: 1, updatedAt: -1 }).limit(250);
    res.json({ tasks });
  })
);

router.post(
  "/",
  validate(createTaskSchema),
  asyncHandler(async (req, res) => {
    const description = req.body.description ? sanitizeHtml(req.body.description) : undefined;
    const task = await Task.create({
      workspace: req.body.workspaceId,
      board: req.body.boardId,
      key: req.body.key,
      title: req.body.title,
      description,
      status: req.body.status,
      priority: req.body.priority,
      labels: req.body.labels,
      tags: req.body.tags,
      assignees: req.body.assignees,
      reporter: req.user!.id,
      storyPoints: req.body.storyPoints,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined
    });

    if (task.dueDate) {
      await getReminderQueue().add(
        "deadline-alert",
        { taskId: task.id, workspaceId: task.workspace.toString() },
        { delay: Math.max(task.dueDate.getTime() - Date.now() - 60 * 60 * 1000, 0) }
      );
    }

    await ActivityLog.create({
      workspace: task.workspace,
      actor: req.user!.id,
      entityType: "task",
      entityId: task._id,
      action: "task.created",
      metadata: { key: task.key, title: task.title }
    });

    req.app.get("io")?.to(`workspace:${task.workspace}`).emit("task:created", { task });
    res.status(201).json({ task });
  })
);

router.patch(
  "/:taskId",
  validate(
    z.object({
      body: createTaskSchema.shape.body.partial().extend({
        richText: z.unknown().optional(),
        subtasks: z.array(z.object({ title: z.string(), done: z.boolean() })).optional(),
        checklists: z.unknown().optional(),
        dependencies: z.array(z.string()).optional(),
        recurringRule: z.string().optional()
      }),
      params: z.object({ taskId: z.string().min(1) })
    })
  ),
  asyncHandler(async (req, res) => {
    const update = { ...req.body };
    if (update.description) update.description = sanitizeHtml(update.description);
    const task = await Task.findByIdAndUpdate(req.params.taskId, update, { new: true });
    if (!task) throw new AppError("Task not found", 404);
    req.app.get("io")?.to(`workspace:${task.workspace}`).emit("task:updated", { task });
    res.json({ task });
  })
);

router.patch(
  "/:taskId/move",
  validate(
    z.object({
      body: z.object({
        status: z.string().min(1),
        position: z.number().default(0)
      }),
      params: z.object({ taskId: z.string().min(1) })
    })
  ),
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status: req.body.status, position: req.body.position },
      { new: true }
    );
    if (!task) throw new AppError("Task not found", 404);
    await ActivityLog.create({
      workspace: task.workspace,
      actor: req.user!.id,
      entityType: "task",
      entityId: task._id,
      action: "task.moved",
      metadata: { status: task.status, position: task.position }
    });
    req.app.get("io")?.to(`workspace:${task.workspace}`).emit("task:moved", { taskId: task.id, status: task.status, position: task.position });
    res.json({ task });
  })
);

router.post(
  "/:taskId/comments",
  validate(
    z.object({
      body: z.object({
        workspaceId: z.string().min(1),
        body: z.string().min(1).max(4000),
        mentions: z.array(z.string()).default([])
      }),
      params: z.object({ taskId: z.string().min(1) })
    })
  ),
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.taskId);
    if (!task) throw new AppError("Task not found", 404);
    const comment = await Comment.create({
      workspace: req.body.workspaceId,
      task: task._id,
      author: req.user!.id,
      body: sanitizeHtml(req.body.body),
      mentions: req.body.mentions
    });
    await Notification.insertMany(
      req.body.mentions.map((user: string) => ({
        workspace: req.body.workspaceId,
        user,
        type: "mention",
        title: `Mentioned on ${task.key}`,
        body: comment.body,
        href: `/board/${task.board}?task=${task.id}`
      }))
    );
    req.app.get("io")?.to(`workspace:${task.workspace}`).emit("comment:created", { taskId: task.id, comment });
    res.status(201).json({ comment });
  })
);

router.post(
  "/:taskId/archive",
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.taskId, { archivedAt: new Date() }, { new: true });
    if (!task) throw new AppError("Task not found", 404);
    req.app.get("io")?.to(`workspace:${task.workspace}`).emit("task:archived", { taskId: task.id });
    res.json({ task });
  })
);

export { router as taskRouter };
