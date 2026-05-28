import type { ActivityItem, BoardColumn, FocusSession, SprintMetric, Task, User } from "./types";

export const users: User[] = [
  { id: "u1", name: "Avery Stone", role: "Product Lead", avatar: "AS", presence: "online" },
  { id: "u2", name: "Mira Kapoor", role: "Design Systems", avatar: "MK", presence: "focus" },
  { id: "u3", name: "Noah Chen", role: "Platform", avatar: "NC", presence: "online" },
  { id: "u4", name: "Elena Ruiz", role: "Data", avatar: "ER", presence: "offline" }
];

export const boardColumns: BoardColumn[] = [
  { id: "backlog", title: "Backlog", accent: "from-slate-400 to-sky-300" },
  { id: "ready", title: "Ready", accent: "from-lavender-300 to-fuchsia-300" },
  { id: "active", title: "In Flight", accent: "from-cyan-300 to-blue-400" },
  { id: "review", title: "Review", accent: "from-peach-300 to-amber-300" },
  { id: "done", title: "Done", accent: "from-mint-300 to-emerald-300" }
];

export const tasks: Task[] = [
  {
    id: "FF-101",
    title: "AI sprint planning assistant",
    summary: "Generate a sprint plan from backlog intent, capacity, dependencies, and recent cycle-time signals.",
    status: "active",
    priority: "urgent",
    labels: ["AI", "Sprint"],
    assignees: ["AS", "NC"],
    storyPoints: 8,
    dueDate: "Jun 04",
    progress: 68,
    comments: 18,
    attachments: 4,
    focusMinutes: 210,
    subtasks: [
      { title: "Capacity model", done: true },
      { title: "Dependency resolver", done: true },
      { title: "Planner confidence UI", done: false }
    ]
  },
  {
    id: "FF-118",
    title: "Fullscreen deep work mode",
    summary: "Create immersive timer shell with ambient controls, task linking, and focus achievements.",
    status: "review",
    priority: "high",
    labels: ["Pomodoro", "Focus"],
    assignees: ["MK"],
    storyPoints: 5,
    dueDate: "Jun 02",
    progress: 84,
    comments: 9,
    attachments: 2,
    focusMinutes: 320,
    subtasks: [
      { title: "Keyboard shortcuts", done: true },
      { title: "Mini timer", done: true },
      { title: "Achievement states", done: false }
    ]
  },
  {
    id: "FF-126",
    title: "Workspace invite permissions",
    summary: "Ship granular role policies for admins, billing owners, sprint leads, and guests.",
    status: "ready",
    priority: "medium",
    labels: ["Security", "Teams"],
    assignees: ["ER"],
    storyPoints: 3,
    dueDate: "Jun 07",
    progress: 24,
    comments: 6,
    attachments: 1,
    focusMinutes: 90,
    subtasks: [
      { title: "Policy matrix", done: true },
      { title: "Invite flow", done: false },
      { title: "Audit events", done: false }
    ]
  },
  {
    id: "FF-132",
    title: "Realtime activity timeline",
    summary: "Presence, typing indicators, card movement, mentions, and comment events over Socket.io rooms.",
    status: "active",
    priority: "high",
    labels: ["Realtime"],
    assignees: ["NC"],
    storyPoints: 8,
    dueDate: "Jun 05",
    progress: 52,
    comments: 14,
    attachments: 3,
    focusMinutes: 160,
    subtasks: [
      { title: "Presence rooms", done: true },
      { title: "Comment typing", done: false },
      { title: "Notification fanout", done: false }
    ]
  },
  {
    id: "FF-140",
    title: "Calendar drag scheduling",
    summary: "Plan tasks, focus blocks, sprint ceremonies, and release milestones from one adaptive calendar.",
    status: "backlog",
    priority: "medium",
    labels: ["Calendar"],
    assignees: ["AS", "ER"],
    storyPoints: 5,
    dueDate: "Jun 12",
    progress: 12,
    comments: 3,
    attachments: 0,
    focusMinutes: 55,
    subtasks: [
      { title: "Agenda data model", done: false },
      { title: "Google sync contract", done: false }
    ]
  },
  {
    id: "FF-151",
    title: "Cloudinary attachment pipeline",
    summary: "Secure uploads for files, voice notes, previews, retention rules, and virus scanning handoff.",
    status: "done",
    priority: "low",
    labels: ["Files"],
    assignees: ["NC"],
    storyPoints: 3,
    dueDate: "May 28",
    progress: 100,
    comments: 12,
    attachments: 7,
    focusMinutes: 140,
    subtasks: [
      { title: "Signed upload", done: true },
      { title: "Preview metadata", done: true }
    ]
  }
];

export const sprintMetrics: SprintMetric[] = [
  { label: "Focus score", value: "92", delta: "+14%", tone: "blue" },
  { label: "Done this week", value: "48", delta: "+18 tasks", tone: "mint" },
  { label: "Time tracked", value: "186h", delta: "+22h", tone: "peach" },
  { label: "Sprint health", value: "97%", delta: "On pace", tone: "violet" }
];

export const focusSessions: FocusSession[] = [
  { day: "Mon", minutes: 210, score: 86 },
  { day: "Tue", minutes: 260, score: 91 },
  { day: "Wed", minutes: 190, score: 78 },
  { day: "Thu", minutes: 320, score: 96 },
  { day: "Fri", minutes: 280, score: 93 },
  { day: "Sat", minutes: 120, score: 72 },
  { day: "Sun", minutes: 160, score: 80 }
];

export const activity: ActivityItem[] = [
  { id: "a1", user: "Mira", action: "linked focus session to", target: "FF-118", time: "2m ago" },
  { id: "a2", user: "Noah", action: "moved", target: "FF-132 to In Flight", time: "8m ago" },
  { id: "a3", user: "Avery", action: "asked AI to summarize", target: "Sprint 12", time: "14m ago" },
  { id: "a4", user: "Elena", action: "created dependency for", target: "FF-126", time: "25m ago" }
];

export const heatmap = Array.from({ length: 49 }, (_, index) => ({
  id: index,
  intensity: [0.15, 0.35, 0.55, 0.82, 1][(index * 7 + 3) % 5]
}));
