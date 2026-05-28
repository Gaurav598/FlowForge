import { Schema, model, models, type Document, type Types } from "mongoose";

export interface CommentDocument extends Document {
  workspace: Types.ObjectId;
  task: Types.ObjectId;
  author: Types.ObjectId;
  body: string;
  mentions: Types.ObjectId[];
  editedAt?: Date;
}

const commentSchema = new Schema<CommentDocument>(
  {
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, maxlength: 4000 },
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
    editedAt: Date
  },
  { timestamps: true }
);

commentSchema.index({ task: 1, createdAt: -1 });

export const Comment = models.Comment || model<CommentDocument>("Comment", commentSchema);
