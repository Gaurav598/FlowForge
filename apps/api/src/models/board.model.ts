import { Schema, model, models, type Document, type Types } from "mongoose";

export interface BoardDocument extends Document {
  workspace: Types.ObjectId;
  name: string;
  key: string;
  type: "kanban" | "scrum" | "hybrid";
  columns: Array<{
    id: string;
    name: string;
    order: number;
    wipLimit?: number;
    color: string;
  }>;
  swimlanes: Array<{ id: string; name: string; query?: string }>;
  archivedAt?: Date;
}

const boardSchema = new Schema<BoardDocument>(
  {
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, uppercase: true, trim: true },
    type: { type: String, enum: ["kanban", "scrum", "hybrid"], default: "hybrid" },
    columns: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        order: { type: Number, required: true },
        wipLimit: Number,
        color: { type: String, default: "#38bdf8" }
      }
    ],
    swimlanes: [{ id: String, name: String, query: String }],
    archivedAt: Date
  },
  { timestamps: true }
);

boardSchema.index({ workspace: 1, key: 1 }, { unique: true });

export const Board = models.Board || model<BoardDocument>("Board", boardSchema);
