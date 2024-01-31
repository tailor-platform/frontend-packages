import { redirect } from "next/navigation";
import { clientSessionPath, internalUnauthorizedPath } from "../lib/config";
import { internalExchangeTokenForSession } from "../lib/core";
import { ErrorResponse, SessionOption, SessionResult } from "@lib/types";
import { useTailorAuth } from "@client/provider";

export type UserInfo = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
};

export const useTailorAuthUtils = () => {
  const config = useTailorAuth();

  const makeLoginUrl = (path: string): string => {
    const apiLoginUrl = config.apiUrl(config.loginPath());
    const callbackPath = config.loginCallbackPath();
    const redirectUrl = encodeURI(
      `${config.appUrl(callbackPath)}?redirect_uri=${path}`,
    );
    return `${apiLoginUrl}?redirect_uri=${redirectUrl}`;
  };

  const exchangeTokenForSession = (code: string) =>
    internalExchangeTokenForSession(config, code);

  const refreshToken = async (
    refreshToken: string,
  ): Promise<SessionResult | ErrorResponse> => {
    const refreshTokenPath = config.refreshTokenPath();
    const formData = new FormData();
    formData.append("refresh_token", refreshToken);
    const res = await fetch(config.apiUrl(refreshTokenPath), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `refresh_token=${encodeURIComponent(refreshToken)}`,
    });

    const text = await res.text();
    return JSON.parse(text) as SessionResult;
  };

  const getLoggedInPlatformUser = async (
    token: string,
  ): Promise<UserInfo | ErrorResponse> => {
    const userInfoPath = config.userInfoPath();
    const res = await fetch(config.apiUrl(userInfoPath), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const text = await res.text();
    return JSON.parse(text) as UserInfo;
  };

  return {
    makeLoginUrl,
    exchangeTokenForSession,
    refreshToken,
    getLoggedInPlatformUser,
  };
};

let useSessionResult: SessionResult | null = null;
export const useSession = (options?: SessionOption) => {
  const config = useTailorAuth();

  const getSession = async () => {
    const rawResp = await fetch(config.appUrl(clientSessionPath));
    const r = (await rawResp.json()) as SessionResult;
    useSessionResult = r;
  };

  if (!useSessionResult) {
    throw getSession();
  }

  if (options?.required && useSessionResult.token === undefined) {
    redirect(internalUnauthorizedPath);
  }

  return useSessionResult;
};
