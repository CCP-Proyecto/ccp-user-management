import { env } from "bun";
import { Hono } from "hono";

import { auth } from "@/lib/auth";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

export default {
  port: env.PORT ?? 3000,
  fetch: app.fetch,
};
