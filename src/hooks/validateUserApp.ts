import { createAuthMiddleware, APIError } from "better-auth/api";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user } from "@/db/schema/auth-schema";

const validApps = ["ccp-web", "ccp-sales", "ccp-customer"];

export const validateUserApp = createAuthMiddleware(async (ctx) => {
  if ((ctx.context?.returned as APIError)?.status) {
    return;
  }

  if (ctx.path !== "/sign-in/email") {
    return;
  }

  const { email, app } = ctx.body;

  const signedInUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (!signedInUser) {
    throw new APIError("FORBIDDEN", {
      code: "FORBIDDEN",
      message: "Account not allowed",
    });
  }

  if (!validApps.includes(app)) {
    throw new APIError("FORBIDDEN", {
      code: "FORBIDDEN",
      message: "Account not allowed",
    });
  }

  if (app === "ccp-web" && !signedInUser.roles.includes("admin")) {
    throw new APIError("FORBIDDEN", {
      code: "FORBIDDEN",
      message: "Account not allowed",
    });
  }

  if (app === "ccp-sales" && !signedInUser?.roles.includes("salesman")) {
    throw new APIError("FORBIDDEN", {
      code: "FORBIDDEN",
      message: "Account not allowed",
    });
  }

  if (app === "ccp-customer" && !signedInUser?.roles.includes("customer")) {
    throw new APIError("FORBIDDEN", {
      code: "FORBIDDEN",
      message: "Account not allowed",
    });
  }
});
