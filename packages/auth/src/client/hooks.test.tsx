import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { renderHook, waitFor, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { http, HttpResponse } from "msw";
import { useAuth, usePlatform, useSession } from "./hooks";
import { TailorAuthProvider } from "./provider";
import { buildMockServer, mockAuthConfig, mockSession } from "@tests/mocks";
import { withMockReplace } from "@tests/helper";
import { internalClientSessionPath } from "@server/middleware/internal";
import { internalClientSessionLoader } from "@core/loader";

const mockProvider = (props: React.PropsWithChildren) => (
  <TailorAuthProvider config={mockAuthConfig}>
    {props.children}
  </TailorAuthProvider>
);

const mockServer = buildMockServer();
beforeAll(() => mockServer.listen());
afterEach(() => {
  internalClientSessionLoader.clear();
  mockServer.resetHandlers();
});
afterAll(() => mockServer.close());

describe("useAuth", () => {
  describe("login", () => {
    it("works as default strategy if no strategy specified", async () => {
      const replaceMock = vi.fn();
      await withMockReplace(replaceMock, async () => {
        const { result } = renderHook(() => useAuth(), {
          wrapper: mockProvider,
        });
        await result.current.login({
          options: { redirectPath: "/redirect-path" },
        });
      });

      expect(replaceMock).toHaveBeenCalledWith(
        "https://mock-api-url.com/mock-login?redirect_uri=http://localhost:3000/__auth/callback/default?redirect_uri=/redirect-path",
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

      const r = await waitFor(() => result.current.getCurrentUser());
      expect(r.data).toHaveProperty("sub");
      expect(r.error).toBeNull();
    });
  });
});

describe("useSession", () => {
  const SuspendingWrapper = (props: React.PropsWithChildren) => {
    return (
      <TailorAuthProvider config={mockAuthConfig}>
        <Suspense fallback={<div>Suspending</div>}>{props.children}</Suspense>
      </TailorAuthProvider>
    );
  };

  it("suspends component while fetching and returns token when finished", async () => {
    const TestComponent = () => {
      const session = useSession();
      return <div>token: {session?.token}</div>;
    };

    await withMockReplace(vi.fn(), () => {
      render(<TestComponent />, {
        wrapper: SuspendingWrapper,
      });
    });

    expect(screen.getByText("Suspending")).toBeTruthy();

    await waitFor(() => {
      expect(
        screen.getByText(`token: ${mockSession.access_token}`),
      ).toBeTruthy();
    });
  });

  it("redirects users to the unauthorized route if session is empty", async () => {
    mockServer.use(
      http.post(mockAuthConfig.appUrl(internalClientSessionPath), () => {
        return HttpResponse.json({
          token: undefined,
        });
      }),
    );

    const TestComponent = () => {
      const session = useSession({
        required: true,
      });
      return <div>token: {session?.token}</div>;
    };

    const replaceMock = vi.fn();
    await withMockReplace(replaceMock, () => {
      render(<TestComponent />, {
        wrapper: SuspendingWrapper,
      });
    });

    expect(replaceMock).toHaveBeenCalled();
  });
});
