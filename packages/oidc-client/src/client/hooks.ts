import { ErrorResponse, SessionOption, SessionResult } from "@lib/types";
import { useTailorAuth } from "@client/provider";
import {
  internalClientSessionPath,
  internalUnauthorizedPath,
} from "@server/middleware/internal";

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

// useAuth is a hook that abstracts out provider-agnostic interface functions related to authorization
export const useAuth = () => {
  const config = useTailorAuth();

  const login = (args: { redirectPath: string }) => {
    assertWindowIsAvailable();

    const apiLoginUrl = config.apiUrl(config.loginPath());
    const callbackPath = config.loginCallbackPath();
    const redirectUrl = encodeURI(
      `${config.appUrl(callbackPath)}?redirect_uri=${args.redirectPath}`,
    );

    window.location.replace(`${apiLoginUrl}?redirect_uri=${redirectUrl}`);
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
    refreshToken,
  };
};

// usePlatform is a hook that contains Tailor Platform specific functions
export const usePlatform = () => {
  const config = useTailorAuth();

  const getCurrentUser = async (
    token: string,
  ): Promise<UserInfo | ErrorResponse> => {
    const userInfoPath = config.userInfoPath();
    const res = await fetch(config.apiUrl(userInfoPath), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return (await res.json()) as UserInfo;
  };

  return {
    getCurrentUser,
  };
};

let internalClientSession: SessionResult | null = null;
export const useSession = (options?: SessionOption) => {
  assertWindowIsAvailable();

  const config = useTailorAuth();

  const getSession = async () => {
    const rawResp = await fetch(config.appUrl(internalClientSessionPath));
    const r = (await rawResp.json()) as SessionResult;
    internalClientSession = r;
  };

  if (!internalClientSession) {
    throw getSession();
  }

  if (options?.required && internalClientSession.token === undefined) {
    window.location.replace(config.appUrl(internalUnauthorizedPath));
    return;
  }

  return internalClientSession;
};

// Clear session internally stored on memory (this is only for test usage)
export const clearClientSession = () => {
  internalClientSession = null;
};
