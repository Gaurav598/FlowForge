import { Schema, model, models, type Document, type Types } from "mongoose";

export interface TaskDocument extends Document {
  workspace: Types.ObjectId;
  board: Types.ObjectId;
  key: string;
  title: string;
  description?: string;
  richText?: unknown;
  status: string;
  priority: "urgent" | "high" | "medium" | "low";
  labels: string[];
  tags: string[];
  emojis: string[];
  assignees: Types.ObjectId[];
  reporter: Types.ObjectId;
  dueDate?: Date;
  startDate?: Date;
  storyPoints: number;
  timeEstimateMinutes: number;
  timeTrackedMinutes: number;
  recurringRule?: string;
  dependencies: Types.ObjectId[];
  subtasks: Array<{ title: string; done: boolean; assignee?: Types.ObjectId }>;
  checklists: Array<{ title: string; items: Array<{ text: string; done: boolean }> }>;
  position: number;
  ai: {
    summary?: string;
    priorityReason?: string;
    breakdown?: string[];
  };
  archivedAt?: Date;
}

const taskSchema = new Schema<TaskDocument>(
  {
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true, index: true },
    key: { type: String, required: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, maxlength: 8000 },
    richText: Schema.Types.Mixed,
    status: { type: String, required: true, index: true },
    priority: { type: String, enum: ["urgent", "high", "medium", "low"], default: "medium", index: true },
    labels: [{ type: String, index: true }],
    tags: [{ type: String, index: true }],
    emojis: [String],
    assignees: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date, index: true },
    startDate: Date,
    storyPoints: { type: Number, default: 0 },
    timeEstimateMinutes: { type: Number, default: 0 },
    timeTrackedMinutes: { type: Number, default: 0 },
    recurringRule: String,
    dependencies: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    subtasks: [{ title: String, done: { type: Boolean, default: false }, assignee: { type: Schema.Types.ObjectId, ref: "User" } }],
    checklists: [
      {
        title: String,
        items: [{ text: String, done: { type: Boolean, default: false } }]
      }
    ],
    position: { type: Number, default: 0, index: true },
    ai: {
      summary: String,
      priorityReason: String,
      breakdown: [String]
    },
    archivedAt: Date
  },
  { timestamps: true }
);

taskSchema.index({ workspace: 1, board: 1, status: 1, position: 1 });
taskSchema.index({ title: "text", description: "text", labels: "text", tags: "text" });
taskSchema.index({ workspace: 1, key: 1 }, { unique: true });

export const Task = models.Task || model<TaskDocument>("Task", taskSchema);
