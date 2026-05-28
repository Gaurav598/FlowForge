import { Schema, model, models, type Document, type Types } from "mongoose";

export interface AnalyticsDocument extends Document {
  workspace: Types.ObjectId;
  board?: Types.ObjectId;
  date: Date;
  scope: "workspace" | "board" | "user";
  subject?: Types.ObjectId;
  metrics: {
    completedTasks: number;
    focusMinutes: number;
    cycleTimeHours: number;
    velocityPoints: number;
    focusScore: number;
  };
}

const analyticsSchema = new Schema<AnalyticsDocument>(
  {
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    board: { type: Schema.Types.ObjectId, ref: "Board", index: true },
    date: { type: Date, required: true, index: true },
    scope: { type: String, enum: ["workspace", "board", "user"], required: true, index: true },
    subject: { type: Schema.Types.ObjectId, index: true },
    metrics: {
      completedTasks: { type: Number, default: 0 },
      focusMinutes: { type: Number, default: 0 },
      cycleTimeHours: { type: Number, default: 0 },
      velocityPoints: { type: Number, default: 0 },
      focusScore: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

analyticsSchema.index({ workspace: 1, scope: 1, date: -1 });

export const Analytics = models.Analytics || model<AnalyticsDocument>("Analytics", analyticsSchema);
