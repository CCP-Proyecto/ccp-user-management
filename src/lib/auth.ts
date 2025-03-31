import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

import { db } from "@/db";
import { account, session, user, verification } from "@/db/schema/auth-schema";
import { validateUserApp } from "@/hooks";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  user: {
    additionalFields: {
      roles: {
        type: "string[]",
        required: true,
        fieldName: "roles",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  trustedOrigins: ["http://localhost:3001"],
  plugins: [openAPI()],
  hooks: {
    after: validateUserApp,
  },
});
