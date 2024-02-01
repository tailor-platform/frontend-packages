import { test, describe, expect } from "vitest";
import { internalExchangeTokenForSession } from "./core";
import { Session } from "./types";
import { mockAuthConfig, mockSession } from "@tests/mocks";

describe("core", () => {
  const fetchSpy = vi.spyOn(global, "fetch");

  beforeEach(() => {
    fetchSpy.mockResolvedValue(new Response(JSON.stringify(mockSession)));
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  test("internalExchangeTokenForSession", async () => {
    const sessionResult = (await internalExchangeTokenForSession(
      mockAuthConfig,
      "mockCode",
    )) as Session;

    expect(sessionResult.access_token).toBe("mockAccessToken");
    expect(sessionResult.refresh_token).toBe("mockRefreshToken");
  });
});
