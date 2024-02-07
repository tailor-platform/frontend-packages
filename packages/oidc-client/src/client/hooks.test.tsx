import { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth, usePlatform } from "./hooks";
import { TailorAuthProvider } from "./provider";
import { buildMockServer, mockAuthConfig } from "@tests/mocks";

const mockProvider = ({ children }: { children: ReactNode }) => (
  <TailorAuthProvider config={mockAuthConfig}>{children}</TailorAuthProvider>
);

const mockServer = buildMockServer();
beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

describe("useAuth", () => {
  describe("login", () => {
    it("correctly redirects to the login URL", () => {
      // we can't simply spy on the window.location.replace method, need to completely
      // replace the window.location object.
      const originalWindowLocation = window.location;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      delete (window as any).location;
      const replaceMock = vi.fn();
      window.location = { ...originalWindowLocation, replace: replaceMock };

      const { result } = renderHook(() => useAuth(), {
        wrapper: mockProvider,
      });
      result.current.login({ redirectPath: "/redirect-path" });

      expect(replaceMock).toHaveBeenCalledWith(
        "https://mock-api-url.com/mock-login?redirect_uri=http://localhost:3000/mock-callback?redirect_uri=/redirect-path",
      );

      window.location = originalWindowLocation;
    });
  });

  describe("refreshToken", () => {
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
});

describe("usePlatform", () => {
  describe("getCurrentUser", () => {
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
});
