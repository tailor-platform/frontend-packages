import { redirect } from "next/navigation";
import { clientSessionPath, internalUnauthorizedPath } from "../lib/config";
import { ErrorResponse, SessionOption, SessionResult } from "@lib/types";
import { useTailorAuth } from "@client/provider";

export type UserInfo = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
};

// useAuth is a hook that abstracts out provider-agnostic interface functions related to authorization
export const useAuth = () => {
  const config = useTailorAuth();

  const login = (args: { redirectPath: string }): string => {
    const apiLoginUrl = config.apiUrl(config.loginPath());
    const callbackPath = config.loginCallbackPath();
    const redirectUrl = encodeURI(
      `${config.appUrl(callbackPath)}?redirect_uri=${args.redirectPath}`,
    );
    return redirect(`${apiLoginUrl}?redirect_uri=${redirectUrl}`);
  };

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
    const text = await res.text();
    return JSON.parse(text) as UserInfo;
  };

  return {
    getCurrentUser,
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
