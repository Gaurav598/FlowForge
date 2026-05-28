import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireWorkspace } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { Board } from "../models/board.model";
import { Task } from "../models/task.model";
import { AppError } from "../utils/app-error";

const router = Router();
router.use(requireAuth);

const defaultColumns = [
  { id: "backlog", name: "Backlog", order: 0, color: "#94a3b8" },
  { id: "ready", name: "Ready", order: 1, color: "#c9a8ff" },
  { id: "active", name: "In Flight", order: 2, color: "#38bdf8" },
  { id: "review", name: "Review", order: 3, color: "#ffa16f" },
  { id: "done", name: "Done", order: 4, color: "#7dffc8" }
];

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const boards = await Board.find({ workspace: req.query.workspaceId, archivedAt: { $exists: false } }).sort({ updatedAt: -1 });
    res.json({ boards });
  })
);

router.post(
  "/",
  validate(
    z.object({
      body: z.object({
        workspaceId: z.string().min(1),
        name: z.string().min(2).max(120),
        key: z.string().min(2).max(8),
        type: z.enum(["kanban", "scrum", "hybrid"]).default("hybrid")
      })
    })
  ),
  asyncHandler(async (req, res) => {
    const board = await Board.create({
      workspace: req.body.workspaceId,
      name: req.body.name,
      key: req.body.key,
      type: req.body.type,
      columns: defaultColumns,
      swimlanes: []
    });
    res.status(201).json({ board });
  })
);

router.get(
  "/:boardId",
  asyncHandler(async (req, res) => {
    const board = await Board.findById(req.params.boardId);
    if (!board) throw new AppError("Board not found", 404);
    const tasks = await Task.find({ board: board._id, archivedAt: { $exists: false } }).sort({ status: 1, position: 1 });
    res.json({ board, tasks });
  })
);

router.patch(
  "/:boardId/columns",
  requireWorkspace,
  validate(
    z.object({
      body: z.object({
        columns: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            order: z.number(),
            wipLimit: z.number().optional(),
            color: z.string()
          })
        )
      }),
      params: z.object({ boardId: z.string().min(1) })
    })
  ),
  asyncHandler(async (req, res) => {
    const board = await Board.findByIdAndUpdate(req.params.boardId, { columns: req.body.columns }, { new: true });
    if (!board) throw new AppError("Board not found", 404);
    req.app.get("io")?.to(`workspace:${board.workspace}`).emit("board:columns-updated", { boardId: board.id, columns: board.columns });
    res.json({ board });
  })
);

export { router as boardRouter };
