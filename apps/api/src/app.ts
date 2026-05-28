import express from "express";
import { AppError } from "./utils/app-error";
import { errorHandler } from "./middleware/error.middleware";
import { applySecurityMiddleware } from "./middleware/security.middleware";
import { authRouter } from "./routes/auth.routes";
import { workspaceRouter } from "./routes/workspace.routes";
import { boardRouter } from "./routes/board.routes";
import { taskRouter } from "./routes/task.routes";
import { pomodoroRouter } from "./routes/pomodoro.routes";
import { analyticsRouter } from "./routes/analytics.routes";
import { notificationRouter } from "./routes/notification.routes";
import { searchRouter } from "./routes/search.routes";
import { aiRouter } from "./routes/ai.routes";
import { uploadRouter } from "./routes/upload.routes";
import { calendarRouter } from "./routes/calendar.routes";
import { teamRouter } from "./routes/team.routes";

export function createApp() {
  const app = express();

  applySecurityMiddleware(app);
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "flowforge-api",
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/workspaces", workspaceRouter);
  app.use("/api/boards", boardRouter);
  app.use("/api/tasks", taskRouter);
  app.use("/api/pomodoro", pomodoroRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/notifications", notificationRouter);
  app.use("/api/search", searchRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/uploads", uploadRouter);
  app.use("/api/calendar", calendarRouter);
  app.use("/api/team", teamRouter);

  app.use((req, _res, next) => {
    next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, "NOT_FOUND"));
  });
  app.use(errorHandler);

  return app;
}
