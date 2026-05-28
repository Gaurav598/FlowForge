"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";

export function useSocket(workspaceId = "flowforge-hq") {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const client = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      auth: { workspaceId }
    });

    client.on("connect", () => setConnected(true));
    client.on("disconnect", () => setConnected(false));
    client.emit("workspace:join", { workspaceId });

    return () => {
      client.disconnect();
    };
  }, [workspaceId]);

  return { connected };
}
