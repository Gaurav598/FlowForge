import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/async-handler";
import { Task } from "../models/task.model";
import { Board } from "../models/board.model";
import { redis } from "../config/redis";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const q = String(req.query.q ?? "").trim();
    const workspaceId = String(req.query.workspaceId ?? req.user!.workspaceId ?? "");
    const cacheKey = `search:${workspaceId}:${q}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const [tasks, boards] = await Promise.all([
      Task.find({ workspace: workspaceId, $text: { $search: q } }).limit(20),
      Board.find({ workspace: workspaceId, name: new RegExp(q, "i") }).limit(10)
    ]);
    const result = {
      tasks,
      boards,
      suggestions: [
        `Summarize ${q || "current sprint"}`,
        `Create task from ${q || "meeting notes"}`,
        `Prioritize ${q || "backlog"}`
      ]
    };
    await redis.set(cacheKey, JSON.stringify(result), "EX", 45);
    res.json(result);
  })
);

export { router as searchRouter };
