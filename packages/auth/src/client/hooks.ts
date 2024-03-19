import { ErrorResponse, SessionOption, SessionResult } from "@core/types";
import { useTailorAuth } from "@client/provider";
import {
  callbackByStrategy,
  internalClientSessionPath,
  internalLogoutPath,
  internalUnauthorizedPath,
} from "@server/middleware/internal";
import { Config } from "@core";

export type UserInfo = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
};

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

let internalClientSession: SessionResult | null = null;
const loadSession = async (config: Config) => {
  const rawResp = await fetch(config.appUrl(internalClientSessionPath));
  const session = (await rawResp.json()) as SessionResult;
  internalClientSession = session;
};

const loadSessionSuspense = (config: Config) => {
  if (!internalClientSession) {
    throw loadSession(config);
  }
  return internalClientSession;
};

// usePlatform is a hook that contains Tailor Platform specific functions
export const usePlatform = () => {
  const config = useTailorAuth();
  const session = loadSessionSuspense(config);

  const getCurrentUser = async (): Promise<UserInfo | ErrorResponse> => {
    const userInfoPath = config.userInfoPath();
    const res = await fetch(config.apiUrl(userInfoPath), {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });
    return (await res.json()) as UserInfo;
  };

  return {
    getCurrentUser,
  };
};

export const useSession = (options?: SessionOption): SessionResult => {
  const config = useTailorAuth();

  assertWindowIsAvailable();

  if (options?.required && internalClientSession?.token === undefined) {
    window.location.replace(config.appUrl(internalUnauthorizedPath));
  }

  return loadSessionSuspense(config);
};

// Clear session internally stored on memory (this is only for test usage)
export const clearClientSession = () => {
  internalClientSession = null;
};
