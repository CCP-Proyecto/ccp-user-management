import { describe, test, expect, beforeEach, mock } from "bun:test";
import { APIError } from "better-auth/api";
import { validateUserApp } from "@/hooks";

mock.module("@/db", () => ({
  db: {
    query: {
      user: {
        findFirst: mock(() => null),
      },
    },
  },
}));

const mockDb = require("@/db").db;

describe("validateUserApp", () => {
  let mockContext: any;

  beforeEach(() => {
    mockDb.query.user.findFirst.mockReset();

    mockContext = {
      path: "/sign-in/email",
      body: {
        email: "test@example.com",
        app: "ccp-web",
      },
      context: {
        returned: undefined,
      },
    };
  });

  test("should let non sign-in paths pass through", async () => {
    mockContext.path = "/different-path";

    await expect(async () => {
      await validateUserApp(mockContext);
    }).not.toThrow();
  });

  test("should reject when user doesn't exist", async () => {
    mockDb.query.user.findFirst.mockImplementation(() => null);

    let error: unknown;
    try {
      await validateUserApp(mockContext);
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(APIError);
  });

  test("should reject invalid app name", async () => {
    mockDb.query.user.findFirst.mockImplementation(() => ({
      email: "test@example.com",
      roles: ["admin"],
    }));

    mockContext.body.app = "invalid-app";

    let error: unknown;
    try {
      await validateUserApp(mockContext);
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(APIError);
  });

  test("should allow admin user to access ccp-web", async () => {
    mockDb.query.user.findFirst.mockImplementation(() => ({
      email: "admin@example.com",
      roles: ["admin"],
    }));

    mockContext.body.app = "ccp-web";
    mockContext.body.email = "admin@example.com";

    await expect(async () => {
      await validateUserApp(mockContext);
    }).not.toThrow();
  });

  test("should reject non-admin user accessing ccp-web", async () => {
    mockDb.query.user.findFirst.mockImplementation(() => ({
      email: "customer@example.com",
      roles: ["customer"],
    }));

    mockContext.body.app = "ccp-web";
    mockContext.body.email = "customer@example.com";

    let error: unknown;
    try {
      await validateUserApp(mockContext);
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(APIError);
  });

  test("should allow salesman user to access ccp-sales", async () => {
    mockDb.query.user.findFirst.mockImplementation(() => ({
      email: "sales@example.com",
      roles: ["salesman"],
    }));

    mockContext.body.app = "ccp-sales";
    mockContext.body.email = "sales@example.com";

    await expect(async () => {
      await validateUserApp(mockContext);
    }).not.toThrow();
  });

  test("should allow customer user to access ccp-customer", async () => {
    mockDb.query.user.findFirst.mockImplementation(() => ({
      email: "client@example.com",
      roles: ["customer"],
    }));

    mockContext.body.app = "ccp-customer";
    mockContext.body.email = "client@example.com";

    await expect(async () => {
      await validateUserApp(mockContext);
    }).not.toThrow();
  });
});
