import bcrypt from "bcryptjs";
import { Schema, model, models, type Document, type Types } from "mongoose";

export type WorkspaceRole = "owner" | "admin" | "lead" | "member" | "guest";

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  avatarUrl?: string;
  bio?: string;
  timezone: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  oauthProviders: Array<{ provider: "google" | "github"; providerId: string }>;
  devices: Array<{
    id: string;
    userAgent: string;
    ip: string;
    lastSeenAt: Date;
    revokedAt?: Date;
  }>;
  socialLinks: Array<{ label: string; url: string }>;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    mentions: boolean;
    focusReminders: boolean;
    deadlineAlerts: boolean;
  };
  productivity: {
    focusScore: number;
    streakDays: number;
    tasksCompleted: number;
    focusMinutes: number;
  };
  currentWorkspace?: Types.ObjectId;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, select: false },
    avatarUrl: String,
    bio: { type: String, maxlength: 280 },
    timezone: { type: String, default: "UTC" },
    emailVerified: { type: Boolean, default: false, index: true },
    twoFactorEnabled: { type: Boolean, default: false },
    oauthProviders: [
      {
        provider: { type: String, enum: ["google", "github"], required: true },
        providerId: { type: String, required: true }
      }
    ],
    devices: [
      {
        id: { type: String, required: true },
        userAgent: String,
        ip: String,
        lastSeenAt: { type: Date, default: Date.now },
        revokedAt: Date
      }
    ],
    socialLinks: [{ label: String, url: String }],
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      focusReminders: { type: Boolean, default: true },
      deadlineAlerts: { type: Boolean, default: true }
    },
    productivity: {
      focusScore: { type: Number, default: 70, min: 0, max: 100 },
      streakDays: { type: Number, default: 0 },
      tasksCompleted: { type: Number, default: 0 },
      focusMinutes: { type: Number, default: 0 }
    },
    currentWorkspace: { type: Schema.Types.ObjectId, ref: "Workspace" }
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(candidate: string) {
  if (!this.passwordHash) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User = models.User || model<UserDocument>("User", userSchema);
