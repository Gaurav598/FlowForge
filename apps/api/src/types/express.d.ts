import type { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        workspaceId?: string;
        roles?: string[];
      };
      requestId?: string;
    }
  }
}

export type ObjectIdLike = string | Types.ObjectId;
