import { Schema, model, models, type Document, type Types } from "mongoose";

export interface WorkspaceDocument extends Document {
  name: string;
  slug: string;
  plan: "free" | "pro" | "business" | "enterprise";
  owner: Types.ObjectId;
  members: Array<{
    user: Types.ObjectId;
    role: "owner" | "admin" | "lead" | "member" | "guest";
    joinedAt: Date;
  }>;
  invites: Array<{
    email: string;
    role: string;
    tokenHash: string;
    expiresAt: Date;
    acceptedAt?: Date;
  }>;
  settings: {
    sprintLengthDays: number;
    defaultFocusMode: "25/5" | "50/10" | "custom";
    aiPlanningEnabled: boolean;
    calendarSyncEnabled: boolean;
  };
}

const workspaceSchema = new Schema<WorkspaceDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    plan: { type: String, enum: ["free", "pro", "business", "enterprise"], default: "pro" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["owner", "admin", "lead", "member", "guest"], default: "member" },
        joinedAt: { type: Date, default: Date.now }
      }
    ],
    invites: [
      {
        email: { type: String, lowercase: true, trim: true },
        role: { type: String, default: "member" },
        tokenHash: String,
        expiresAt: Date,
        acceptedAt: Date
      }
    ],
    settings: {
      sprintLengthDays: { type: Number, default: 14 },
      defaultFocusMode: { type: String, enum: ["25/5", "50/10", "custom"], default: "25/5" },
      aiPlanningEnabled: { type: Boolean, default: true },
      calendarSyncEnabled: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

workspaceSchema.index({ "members.user": 1 });
workspaceSchema.index({ "invites.email": 1 });

export const Workspace = models.Workspace || model<WorkspaceDocument>("Workspace", workspaceSchema);
