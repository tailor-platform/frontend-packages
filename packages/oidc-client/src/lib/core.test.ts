import { test, describe, expect } from "vitest";
import { internalExchangeTokenForSession } from "./core";
import { Session } from "./types";
import { mockAuthConfig } from "@tests/config";

describe("core", () => {
  test("internalExchangeTokenForSession", async () => {
    const mockSession: Session = {
      access_token: "mockAccessToken",
      refresh_token: "mockRefreshToken",
      expires_in: 86400,
      user_id: "43a05b99-ebe1-4b89-8284-e4447e3a3551",
    };
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(JSON.stringify(mockSession)));

    const sessionResult = (await internalExchangeTokenForSession(
      mockAuthConfig,
      "mockCode",
    )) as Session;

    expect(sessionResult.access_token).toBe("mockAccessToken");
    expect(sessionResult.refresh_token).toBe("mockRefreshToken");

    fetchSpy.mockRestore();
  });
});
