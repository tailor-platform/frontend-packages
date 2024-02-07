import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { renderHook, waitFor, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { clearClientSession, useAuth, usePlatform, useSession } from "./hooks";
import { TailorAuthProvider } from "./provider";
import { buildMockServer, mockAuthConfig, mockSession } from "@tests/mocks";
import { withMockedReplace } from "@tests/helper";

const mockProvider = (props: React.PropsWithChildren) => (
  <TailorAuthProvider config={mockAuthConfig}>
    {props.children}
  </TailorAuthProvider>
);

const mockServer = buildMockServer();
beforeAll(() => mockServer.listen());
afterEach(() => {
  clearClientSession();
  mockServer.resetHandlers();
});
afterAll(() => mockServer.close());

describe("useAuth", () => {
  describe("login", () => {
    it("correctly redirects to the login URL", async () => {
      const replaceMock = vi.fn();
      await withMockedReplace(replaceMock, () => {
        const { result } = renderHook(() => useAuth(), {
          wrapper: mockProvider,
        });
        result.current.login({ redirectPath: "/redirect-path" });
      });

      expect(replaceMock).toHaveBeenCalledWith(
        "https://mock-api-url.com/mock-login?redirect_uri=http://localhost:3000/mock-callback?redirect_uri=/redirect-path",
      );
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

describe("useSession", () => {
  it("suspends component while fetching and returns token when finished", async () => {
    const TestComponent = () => {
      const session = useSession();
      return <div>token: {session?.token}</div>;
    };

    const replaceMock = vi.fn();
    await withMockedReplace(replaceMock, () => {
      render(<TestComponent />, {
        wrapper: (props: React.PropsWithChildren) => {
          return (
            <TailorAuthProvider config={mockAuthConfig}>
              <Suspense fallback={<div>Suspending</div>}>
                {props.children}
              </Suspense>
            </TailorAuthProvider>
          );
        },
      });
    });

    expect(screen.getByText("Suspending")).toBeTruthy();

    await waitFor(() => {
      expect(
        screen.getByText(`token: ${mockSession.access_token}`),
      ).toBeTruthy();
    });
  });
});
