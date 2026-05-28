import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "./config/env";
import { logger } from "./config/logger";

type PresenceUser = {
  socketId: string;
  workspaceId: string;
  userId?: string;
  name?: string;
  mode?: "online" | "focus" | "away";
};

const presence = new Map<string, PresenceUser>();

export function initializeSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    logger.debug({ socketId: socket.id }, "socket connected");

    socket.on("workspace:join", ({ workspaceId, userId, name }) => {
      const room = `workspace:${workspaceId}`;
      socket.join(room);
      presence.set(socket.id, {
        socketId: socket.id,
        workspaceId,
        userId,
        name,
        mode: "online"
      });
      io.to(room).emit("presence:update", getWorkspacePresence(workspaceId));
    });

    socket.on("presence:focus", ({ workspaceId, mode }) => {
      const entry = presence.get(socket.id);
      if (entry) presence.set(socket.id, { ...entry, mode });
      io.to(`workspace:${workspaceId}`).emit("presence:update", getWorkspacePresence(workspaceId));
    });

    socket.on("task:update", ({ workspaceId, task }) => {
      socket.to(`workspace:${workspaceId}`).emit("task:updated", { task });
    });

    socket.on("comment:typing", ({ workspaceId, taskId, user }) => {
      socket.to(`workspace:${workspaceId}`).emit("comment:typing", { taskId, user });
    });

    socket.on("notification:push", ({ workspaceId, notification }) => {
      socket.to(`workspace:${workspaceId}`).emit("notification:new", { notification });
    });

    socket.on("disconnect", () => {
      const entry = presence.get(socket.id);
      presence.delete(socket.id);
      if (entry) io.to(`workspace:${entry.workspaceId}`).emit("presence:update", getWorkspacePresence(entry.workspaceId));
    });
  });

  return io;
}

function getWorkspacePresence(workspaceId: string) {
  return Array.from(presence.values()).filter((item) => item.workspaceId === workspaceId);
}
