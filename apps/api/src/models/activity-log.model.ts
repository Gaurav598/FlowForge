import { Schema, model, models, type Document, type Types } from "mongoose";

export interface ActivityLogDocument extends Document {
  workspace: Types.ObjectId;
  actor: Types.ObjectId;
  entityType: "task" | "board" | "workspace" | "comment" | "pomodoro" | "sprint";
  entityId: Types.ObjectId;
  action: string;
  metadata: Record<string, unknown>;
}

const activityLogSchema = new Schema<ActivityLogDocument>(
  {
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    actor: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    entityType: { type: String, enum: ["task", "board", "workspace", "comment", "pomodoro", "sprint"], required: true },
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },
    action: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

activityLogSchema.index({ workspace: 1, createdAt: -1 });

export const ActivityLog = models.ActivityLog || model<ActivityLogDocument>("ActivityLog", activityLogSchema);
