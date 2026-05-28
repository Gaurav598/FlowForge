import bcrypt from "bcryptjs";
import { connectDatabase } from "./config/database";
import { redis } from "./config/redis";
import { User } from "./models/user.model";
import { Workspace } from "./models/workspace.model";
import { Board } from "./models/board.model";
import { Task } from "./models/task.model";
import { Analytics } from "./models/analytics.model";
import { PomodoroSession } from "./models/pomodoro-session.model";

async function seed() {
  await connectDatabase();
  await Promise.all([
    User.deleteMany({ email: /@flowforge.demo$/ }),
    Workspace.deleteMany({ slug: /^orbit-labs/ }),
    Board.deleteMany({ key: "FF" })
  ]);

  const passwordHash = await bcrypt.hash("FlowForgeDemo123!", 12);
  const user = await User.create({
    name: "Avery Stone",
    email: "avery@flowforge.demo",
    passwordHash,
    emailVerified: true,
    productivity: {
      focusScore: 92,
      streakDays: 18,
      tasksCompleted: 248,
      focusMinutes: 6420
    }
  });

  const workspace = await Workspace.create({
    name: "Orbit Labs",
    slug: "orbit-labs-demo",
    owner: user._id,
    members: [{ user: user._id, role: "owner" }]
  });
  user.currentWorkspace = workspace._id;
  await user.save();

  const board = await Board.create({
    workspace: workspace._id,
    name: "FlowForge OS",
    key: "FF",
    type: "hybrid",
    columns: [
      { id: "backlog", name: "Backlog", order: 0, color: "#94a3b8" },
      { id: "ready", name: "Ready", order: 1, color: "#c9a8ff" },
      { id: "active", name: "In Flight", order: 2, color: "#38bdf8" },
      { id: "review", name: "Review", order: 3, color: "#ffa16f" },
      { id: "done", name: "Done", order: 4, color: "#7dffc8" }
    ],
    swimlanes: [
      { id: "ai", name: "AI Platform" },
      { id: "focus", name: "Focus Experience" },
      { id: "security", name: "Workspace Security" }
    ]
  });

  await Task.insertMany(
    [
      ["FF-101", "AI sprint planning assistant", "active", "urgent", 8],
      ["FF-118", "Fullscreen deep work mode", "review", "high", 5],
      ["FF-126", "Workspace invite permissions", "ready", "medium", 3],
      ["FF-132", "Realtime activity timeline", "active", "high", 8],
      ["FF-140", "Calendar drag scheduling", "backlog", "medium", 5]
    ].map(([key, title, status, priority, points], index) => ({
      workspace: workspace._id,
      board: board._id,
      key,
      title,
      status,
      priority,
      reporter: user._id,
      assignees: [user._id],
      storyPoints: points,
      position: index,
      labels: ["Demo"],
      ai: {
        summary: `${title} is ready for FlowForge demo workflows.`
      }
    }))
  );

  await PomodoroSession.create({
    workspace: workspace._id,
    user: user._id,
    mode: "50/10",
    startedAt: new Date(),
    endedAt: new Date(),
    focusMinutes: 50,
    breakMinutes: 10,
    productivityScore: 94
  });

  await Analytics.create({
    workspace: workspace._id,
    date: new Date(),
    scope: "workspace",
    metrics: {
      completedTasks: 48,
      focusMinutes: 1860,
      cycleTimeHours: 67,
      velocityPoints: 74,
      focusScore: 92
    }
  });

  redis.disconnect();
  console.log("Seed complete: avery@flowforge.demo / FlowForgeDemo123!");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
