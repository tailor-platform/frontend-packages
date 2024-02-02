import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth, usePlatform } from "./hooks";
import { TailorAuthProvider } from "./provider";
import { mockAuthConfig } from "@tests/mocks";

const redirectMock = vi.hoisted(() => {
  return {
    redirect: vi.fn(),
  };
});
vi.mock("next/navigation", () => {
  return {
    redirect: redirectMock.redirect,
  };
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

describe("useAuth", () => {
  it("correctly constructs the login URL", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: mockProvider,
    });
    result.current.login({ redirectPath: "/redirect-path" });

    expect(redirectMock.redirect).toHaveBeenCalledWith(
      "https://mock-api-url.com/mock-login?redirect_uri=http://localhost:3000/mock-callback?redirect_uri=/redirect-path",
    );
  });

  it("refreshes token for session", async () => {
    const { result } = renderHook(() => useAuth(), {
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

describe("usePlatform", () => {
  it("gets logged-in platform user", async () => {
    const { result } = renderHook(() => usePlatform(), {
      wrapper: mockProvider,
    });

    let userResult = {};
    await waitFor(async () => {
      userResult = await result.current.getCurrentUser("mockToken");
    });

    expect(userResult).toHaveProperty("sub");
  });
});
