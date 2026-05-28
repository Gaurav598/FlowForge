export type Priority = "urgent" | "high" | "medium" | "low";
export type TaskStatus = "backlog" | "ready" | "active" | "review" | "done";

export type User = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  presence: "online" | "focus" | "offline";
};

export type Task = {
  id: string;
  title: string;
  summary: string;
  status: TaskStatus;
  priority: Priority;
  labels: string[];
  assignees: string[];
  storyPoints: number;
  dueDate: string;
  progress: number;
  comments: number;
  attachments: number;
  focusMinutes: number;
  subtasks: { title: string; done: boolean }[];
};

export type BoardColumn = {
  id: TaskStatus;
  title: string;
  accent: string;
};

export type SprintMetric = {
  label: string;
  value: string;
  delta: string;
  tone: "blue" | "mint" | "peach" | "violet";
};

export type FocusSession = {
  day: string;
  minutes: number;
  score: number;
};

export type ActivityItem = {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
};
