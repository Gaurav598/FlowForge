import { Schema, model, models, type Document, type Types } from "mongoose";

export interface NotificationDocument extends Document {
  workspace: Types.ObjectId;
  user: Types.ObjectId;
  type: "mention" | "deadline" | "focus" | "invite" | "system";
  title: string;
  body: string;
  href?: string;
  readAt?: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["mention", "deadline", "focus", "invite", "system"], required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    href: String,
    readAt: Date
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, readAt: 1, createdAt: -1 });

export const Notification = models.Notification || model<NotificationDocument>("Notification", notificationSchema);
