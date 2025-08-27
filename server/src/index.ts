import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as Sentry from "@sentry/node";

import { getEnv } from "./config/env";
import { errorHandler } from "./middleware/error";
import { authRouter } from "./routes/auth";
import { usersRouter } from "./routes/users";
import { eventsRouter } from "./routes/events";

function createApp() {
  const app = express();

  const dsn = process.env.SENTRY_DSN;
  if (dsn) {
    Sentry.init({ dsn, tracesSampleRate: 0.1 });
    // @ts-ignore - handlers exist at runtime
    app.use((Sentry as any).Handlers?.requestHandler?.() || ((_, __, next) => next()));
    // @ts-ignore
    app.use((Sentry as any).Handlers?.tracingHandler?.() || ((_, __, next) => next()));
  }

  const corsOrigins = process.env.CORS_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean);
  app.use(cors(corsOrigins && corsOrigins.length > 0 ? { origin: corsOrigins } : undefined));
  app.use(helmet());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/events", eventsRouter);

  if (dsn) {
    // @ts-ignore
    app.use((Sentry as any).Handlers?.errorHandler?.() || ((err, _req, res, next) => next(err)));
  }

  app.use(errorHandler);

  return app;
}

const env = getEnv();
const app = createApp();
app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${env.PORT}`);
});

export default app;
