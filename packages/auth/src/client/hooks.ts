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
  name?: string;
  options?: Record<string, unknown>;
};

type LogoutParams = {
  redirectPath?: string;
};

// useAuth is a hook that abstracts out provider-agnostic interface functions related to authorization
export const useAuth = () => {
  const config = useTailorAuth();

  const login = async (params?: LoginParams) => {
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
  };

  const logout = (params?: LogoutParams) => {
    assertWindowIsAvailable();

    const searchParams = new URLSearchParams({
      redirect_path: params?.redirectPath || config.loginPath(),
    });
    window.location.replace(
      `${config.appUrl(internalLogoutPath)}?${searchParams.toString()}`,
    );
  };

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
    login,
    logout,
    refreshToken,
  };
};

// usePlatform is a hook that contains Tailor Platform specific functions
export const usePlatform = () => {
  const config = useTailorAuth();

  return {
    getCurrentUser: () => internalUserinfoLoader.getSuspense(config),
  };
};

export const useSession = (options?: SessionOption): SessionResult => {
  const config = useTailorAuth();

  assertWindowIsAvailable();

  const internalClientSession = internalClientSessionLoader.get();
  if (options?.required && internalClientSession?.token === undefined) {
    window.location.replace(config.appUrl(internalUnauthorizedPath));
  }

  return internalClientSessionLoader.getSuspense(config);
};
