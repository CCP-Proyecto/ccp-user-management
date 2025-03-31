import { env } from "bun";
import { Hono } from "hono";

import { auth } from "@/lib/auth";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(
  "/api/auth/*", // or replace with "*" to enable cors for all routes
  cors({
    origin: "http://localhost:3001", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use(logger());

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// app.get("/api/user", async (c) => {
//   const sessionData = await auth.api.getSession({ headers: c.req.raw.headers });

//   if (!sessionData) {
//     return c.json({ error: "Not authenticated" }, 401);
//   }

//   const { user, session } = sessionData;

//   if (!user || !session) {
//     return c.json({ error: "Not authenticated" }, 401);
//   }

//   return c.json(user);
// });

export default {
  port: env.PORT ?? 3000,
  fetch: app.fetch,
};
