import { Queue, Worker } from "bullmq";
import { env } from "./env";
import { logger } from "./logger";

const queueConnection = {
  url: env.REDIS_URL,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true
};

let reminderQueue: Queue | undefined;
let analyticsQueue: Queue | undefined;

export function getReminderQueue() {
  reminderQueue ??= new Queue("deadline-reminders", {
    connection: queueConnection
  });
  return reminderQueue;
}

export function getAnalyticsQueue() {
  analyticsQueue ??= new Queue("analytics-rollups", {
    connection: queueConnection
  });
  return analyticsQueue;
}

export function startWorkers() {
  const reminders = new Worker(
    "deadline-reminders",
    async (job) => {
      logger.info({ jobId: job.id, data: job.data }, "processing reminder job");
      return { delivered: true };
    },
    { connection: queueConnection }
  );

  const analytics = new Worker(
    "analytics-rollups",
    async (job) => {
      logger.info({ jobId: job.id, data: job.data }, "processing analytics rollup");
      return { rolledUp: true };
    },
    { connection: queueConnection }
  );

  reminders.on("failed", (job, error) => logger.error({ jobId: job?.id, error }, "reminder failed"));
  analytics.on("failed", (job, error) => logger.error({ jobId: job?.id, error }, "analytics failed"));

  return [reminders, analytics];
}
