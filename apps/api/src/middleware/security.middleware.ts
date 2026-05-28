import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import pinoHttp from "pino-http";
import type { Express } from "express";
import { randomUUID } from "crypto";
import { env, isProduction } from "../config/env";
import { logger } from "../config/logger";

export function applySecurityMiddleware(app: Express) {
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: isProduction
        ? {
            directives: {
              defaultSrc: ["'self'"],
              imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
              scriptSrc: ["'self'"],
              connectSrc: ["'self'", env.CLIENT_URL]
            }
          }
        : false
    })
  );
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
    })
  );
  app.use(compression());
  app.use(cookieParser());
  app.use(hpp());
  app.use(mongoSanitize());
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 220,
      standardHeaders: "draft-8",
      legacyHeaders: false
    })
  );
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => {
        const id = req.headers["x-request-id"]?.toString() ?? randomUUID();
        req.requestId = id;
        return id;
      }
    })
  );
}
