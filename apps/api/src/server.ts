import http from "http";
import { createApp } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { redis } from "./config/redis";
import { startWorkers } from "./config/queues";
import { initializeSocket } from "./socket";

async function bootstrap() {
  await connectDatabase();

  redis.on("error", (error) => logger.error({ error }, "Redis connection error"));
  redis.on("connect", () => logger.info("Redis connected"));

  const app = createApp();
  const server = http.createServer(app);
  const io = initializeSocket(server);
  app.set("io", io);
  startWorkers();

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "FlowForge API listening");
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Graceful shutdown started");
    io.close();
    server.close(() => {
      redis.disconnect();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

bootstrap().catch((error) => {
  logger.fatal({ error }, "API bootstrap failed");
  process.exit(1);
});
