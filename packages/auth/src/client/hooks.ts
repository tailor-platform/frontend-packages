import { ErrorResponse, SessionOption, SessionResult } from "@core/types";
import { useTailorAuth } from "@client/provider";
import {
  callbackByStrategy,
  internalLogoutPath,
  internalUnauthorizedPath,
} from "@server/middleware/internal";
import {
  internalClientSessionLoader,
  internalUserinfoLoader,
} from "@core/loader";

const NoWindowError = new Error(
  "window object should be available to use this function",
);
const assertWindowIsAvailable = () => {
  if (window === undefined) {
    throw NoWindowError;
  }
};

type LoginParams = {
  /**
   * The name of the strategy to use for login. Available strategies are: "oidc", "saml", "minitailor".
   * If not provided, the "oidc" strategy will be used.
   */
  name?: string;

  /**
   * The argument passed to the strategy's authenticate function.
   * The content of this object is strategy-specific.
   */
  options?: Record<string, unknown>;
};

type LogoutParams = {
  /**
   * The path to redirect to after logout.
   * (default: the path set as `loginPath` in configuration)
   */
  redirectPath?: string;
};

/**
 * A hook that provides authorization functionality for clients
 */
export const useAuth = () => {
  const config = useTailorAuth();

  const refreshToken = async (
    refreshToken: string,
  ): Promise<SessionResult | ErrorResponse> => {
    const refreshTokenPath = config.refreshTokenPath();
    const res = await fetch(config.apiUrl(refreshTokenPath), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `refresh_token=${encodeURIComponent(refreshToken)}`,
    });

    return (await res.json()) as SessionResult;
  };

  return {
    /**
     * A function to initiate authentication process.
     *
     * @example
     * ```
     * "use client";
     * import { useAuth } from "@tailor-platform/auth/client";
     *
     * const Component = async () => {
     *   const { login } = useAuth();
     *   const doLogin = useCallback(() => {
     *     login({
     *       options: {
     *         redirectPath: "/dashboard",
     *       },
     *     });
     *   }, [login]);
     *
     *   return (
     *     <div>
     *       <button onClick={doLogin}>Login</button>
     *     </div>
     *   );
     * };
     * ```
     */
    login: async (params?: LoginParams) => {
      assertWindowIsAvailable();

      const strategy = config.getStrategy(params?.name);
      const result = await strategy.authenticate(config, params?.options || {});
      switch (result.mode) {
        case "redirection":
          window.location.replace(result.uri);
          break;
        case "manual-callback": {
          const params = new URLSearchParams(result.payload);
          const callbackPath = callbackByStrategy(strategy.name());
          window.location.replace(`${callbackPath}?${params.toString()}`);
          break;
        }
        default:
      }
    },

    /**
     * A function to initiate logout process that deletes session token and redirecting to the specified page
     *
     * @example
     * ```
     * "use client";
     * import { useAuth } from "@tailor-platform/auth/client";
     *
     * const Component = async () => {
     *   const { logout } = useAuth();
     *
     *   return (
     *     <div>
     *       <button onClick={() => logout()}>Logout</button>
     *     </div>
     *   );
     * };
     * ```
     */
    logout: (params?: LogoutParams) => {
      assertWindowIsAvailable();

      const searchParams = new URLSearchParams({
        redirect_path: params?.redirectPath || config.loginPath(),
      });
      window.location.replace(
        `${config.appUrl(internalLogoutPath)}?${searchParams.toString()}`,
      );
    },
    refreshToken,
  };
};

/**
 * The hook that provides utility functions for Tailor Platform specific operation
 */
export const usePlatform = () => {
  const config = useTailorAuth();

  return {
    /**
     * A suspense function to retrieve the logged-in user's information.
     *
     * @example
     * ```
     * "use client";
     * import { usePlatform } from "@tailor-platform/auth/client";
     *
     * const Component = async () => {
     *   const { getCurrentUser } = usePlatform();
     *
     *   const user = getCurrentUser();
     * };
     * ```
     */
    getCurrentUser: () => internalUserinfoLoader.getSuspense(config),
  };
};

/**
 * A suspense hook to get token in client components.
 *
 * @example
 * ```
 * "use client";
 * import { useSession } from "@tailor-platform/auth/client";
 *
 * const Page = () => {
 *   const session = useSession({
 *     required: true,
 *   });
 *
 *   return <div>Token: {session.token}</div>;
 * };
 * ```
 */
export const useSession = (options?: SessionOption): SessionResult => {
  const config = useTailorAuth();

  assertWindowIsAvailable();

  const internalClientSession = internalClientSessionLoader.get();
  if (options?.required && internalClientSession?.token === undefined) {
    window.location.replace(config.appUrl(internalUnauthorizedPath));
  }

  return internalClientSessionLoader.getSuspense(config);
};
