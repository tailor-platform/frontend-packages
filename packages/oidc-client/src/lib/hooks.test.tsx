import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useTailorOidcUtils } from "./hooks";
import { TailorOidcProvider } from "./provider";

const mockOidcConfig = {
  apiUrl: "https://mock-api-url.com",
  oidcLoginPath: "/mock-login",
  oidcLoginCallbackPath: "/mock-callback",
  oidcTokenPath: "/mock-token",
  oidcRefreshTokenPath: "/mock-refresh-token",
  oidcUserInfoPath: "/mock-userinfo",
};

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
  <TailorOidcProvider config={mockOidcConfig}>{children}</TailorOidcProvider>
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useTailorOidcUtils", () => {
  it("correctly constructs the login URL", () => {
    const { result } = renderHook(() => useTailorOidcUtils(), {
      wrapper: mockProvider,
    });
    const loginUrl = result.current.makeLoginUrl("/redirect-path");

    expect(loginUrl).toBe(
      "https://mock-api-url.com/mock-login?redirect_uri=http://localhost:3000/mock-callback?redirect_uri=/redirect-path",
    );
  });

  it("exchanges token for session", async () => {
    const { result } = renderHook(() => useTailorOidcUtils(), {
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
    const { result } = renderHook(() => useTailorOidcUtils(), {
      wrapper: mockProvider,
    });

    let userResult = {};
    await waitFor(async () => {
      userResult = await result.current.getLoggedInPlatformUser("mockToken");
    });

    expect(userResult).toHaveProperty("sub");
  });

  it("refresh token for session", async () => {
    const { result } = renderHook(() => useTailorOidcUtils(), {
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
