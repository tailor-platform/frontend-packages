import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { Config } from "@/lib/config";
import { useTailorAuthUtils } from "./hooks";
import { TailorAuthProvider } from "./provider";

const mockAuthConfig = new Config({
  apiHost: "https://mock-api-url.com",
  appHost: "http://localhost:3000",
  loginPath: "/mock-login",
  loginCallbackPath: "/mock-callback",
  tokenPath: "/mock-token",
  refreshTokenPath: "/mock-refresh-token",
  userInfoPath: "/mock-userinfo",
});

const server = setupServer(
  http.post("https://mock-api-url.com/mock-token", () => {
    return HttpResponse.json({
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
    });
  }),
  http.get("https://mock-api-url.com/mock-userinfo", () => {
    return HttpResponse.json({ sub: "mockSub" });
  }),
  http.post("https://mock-api-url.com/mock-refresh-token", () => {
    return HttpResponse.json({
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
    });
  }),
);

const mockProvider = ({ children }: { children: ReactNode }) => (
  <TailorAuthProvider config={mockAuthConfig}>{children}</TailorAuthProvider>
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useTailorAuthUtils", () => {
  it("correctly constructs the login URL", () => {
    const { result } = renderHook(() => useTailorAuthUtils(), {
      wrapper: mockProvider,
    });
    const loginUrl = result.current.makeLoginUrl("/redirect-path");

    expect(loginUrl).toBe(
      "https://mock-api-url.com/mock-login?redirect_uri=http://localhost:3000/mock-callback?redirect_uri=/redirect-path",
    );
  });

  it("exchanges token for session", async () => {
    const { result } = renderHook(() => useTailorAuthUtils(), {
      wrapper: mockProvider,
    });

    let sessionResult = {};
    await waitFor(async () => {
      sessionResult = await result.current.exchangeTokenForSession("mockCode");
    });

    expect(sessionResult).toHaveProperty("accessToken");
    if ("accessToken" in sessionResult) {
      expect(sessionResult.accessToken).toBe("mockAccessToken");
    }
    if ("refreshToken" in sessionResult) {
      expect(sessionResult.refreshToken).toBe("mockRefreshToken");
    }
  });

  it("gets logged-in platform user", async () => {
    const { result } = renderHook(() => useTailorAuthUtils(), {
      wrapper: mockProvider,
    });

    let userResult = {};
    await waitFor(async () => {
      userResult = await result.current.getLoggedInPlatformUser("mockToken");
    });

    expect(userResult).toHaveProperty("sub");
  });

  it("refresh token for session", async () => {
    const { result } = renderHook(() => useTailorAuthUtils(), {
      wrapper: mockProvider,
    });

    let sessionResult = {};
    await waitFor(async () => {
      sessionResult = await result.current.refreshToken("mockToken");
    });

    expect(sessionResult).toHaveProperty("accessToken");
    if ("accessToken" in sessionResult) {
      expect(sessionResult.accessToken).toBe("mockAccessToken");
    }
    if ("refreshToken" in sessionResult) {
      expect(sessionResult.refreshToken).toBe("mockRefreshToken");
    }
  });
});
