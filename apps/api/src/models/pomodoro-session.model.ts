import { Schema, model, models, type Document, type Types } from "mongoose";

export interface PomodoroSessionDocument extends Document {
  workspace: Types.ObjectId;
  user: Types.ObjectId;
  task?: Types.ObjectId;
  mode: "25/5" | "50/10" | "custom" | "stopwatch";
  startedAt: Date;
  endedAt?: Date;
  focusMinutes: number;
  breakMinutes: number;
  ambientSound?: string;
  productivityScore: number;
}

const pomodoroSessionSchema = new Schema<PomodoroSessionDocument>(
  {
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    task: { type: Schema.Types.ObjectId, ref: "Task", index: true },
    mode: { type: String, enum: ["25/5", "50/10", "custom", "stopwatch"], required: true },
    startedAt: { type: Date, required: true, index: true },
    endedAt: Date,
    focusMinutes: { type: Number, required: true },
    breakMinutes: { type: Number, default: 0 },
    ambientSound: String,
    productivityScore: { type: Number, default: 75, min: 0, max: 100 }
  },
  { timestamps: true }
);

pomodoroSessionSchema.index({ workspace: 1, user: 1, startedAt: -1 });

export const PomodoroSession = models.PomodoroSession || model<PomodoroSessionDocument>("PomodoroSession", pomodoroSessionSchema);
