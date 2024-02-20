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

const InvalidAuthenticationFlowError = new Error("invalid authentication flow");
const NoCorrespondingStrategyError = new Error(
  "no corresponding authentication strategy available",
);
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
  options: Record<string, unknown>;
};

// useAuth is a hook that abstracts out provider-agnostic interface functions related to authorization
export const useAuth = () => {
  const config = useTailorAuth();

  const login = async (params?: LoginParams) => {
    assertWindowIsAvailable();

    const name = params?.name || "default";
    const strategy = config.getStrategy(name);
    if (!strategy) {
      throw NoCorrespondingStrategyError;
    }

    const options = params?.options || {};
    const trigger = strategy.authenticate(config, options);
    switch (trigger.mode) {
      case "function-call":
        await trigger.callback();
        break;
      case "redirection":
        window.location.replace(trigger.uri);
        break;
      default:
        throw InvalidAuthenticationFlowError;
    }
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
export const useSession = (options?: SessionOption): SessionResult => {
  const config = useTailorAuth();

  assertWindowIsAvailable();

  if (options?.required && internalClientSession?.token === undefined) {
    window.location.replace(config.appUrl(internalUnauthorizedPath));
  }

  const getSession = async () => {
    const rawResp = await fetch(config.appUrl(internalClientSessionPath));
    const session = (await rawResp.json()) as SessionResult;
    internalClientSession = session;
  };

  if (!internalClientSession) {
    throw getSession();
  }

  return internalClientSession;
};

// Clear session internally stored on memory (this is only for test usage)
export const clearClientSession = () => {
  internalClientSession = null;
};
