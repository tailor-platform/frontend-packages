import { test, describe, expect } from "vitest";
import { internalExchangeTokenForSession } from "./core";
import { mockAuthConfig } from "@tests/config";

describe("core", () => {
  test("internalExchangeTokenForSession", async () => {
    const sessionResult = await internalExchangeTokenForSession(
      mockAuthConfig,
      "mockCode",
    );

    expect(sessionResult).toHaveProperty("accessToken");
    if ("accessToken" in sessionResult) {
      expect(sessionResult.accessToken).toBe("mockAccessToken");
    }
    if ("refreshToken" in sessionResult) {
      expect(sessionResult.refreshToken).toBe("mockRefreshToken");
    }
  });
});
