import { Schema, model, models, type Document, type Types } from "mongoose";

export interface AttachmentDocument extends Document {
  workspace: Types.ObjectId;
  task?: Types.ObjectId;
  uploader: Types.ObjectId;
  url: string;
  publicId: string;
  mimeType: string;
  size: number;
  kind: "file" | "image" | "voice-note";
}

const attachmentSchema = new Schema<AttachmentDocument>(
  {
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    task: { type: Schema.Types.ObjectId, ref: "Task", index: true },
    uploader: { type: Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    kind: { type: String, enum: ["file", "image", "voice-note"], default: "file" }
  },
  { timestamps: true }
);

export const Attachment = models.Attachment || model<AttachmentDocument>("Attachment", attachmentSchema);
