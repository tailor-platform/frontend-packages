import { Config } from "./config";
import { ErrorResponse, Session, UserInfo } from "@lib/types";
import { useTailorAuth } from "@lib/provider";

export const useTailorAuthUtils = () => {
  const config = useTailorAuth();

  const makeLoginUrl = (path: string): string => {
    const apiLoginUrl = config.apiUrl(config.loginPath());
    const callbackPath = config.loginCallbackPath();
    const redirectUrl = encodeURI(
      `${localRedirectUrl(callbackPath)}?redirect_uri=${path}`,
    );
    return `${apiLoginUrl}?redirect_uri=${redirectUrl}`;
  };

  const exchangeTokenForSession = (code: string) =>
    internalExchangeTokenForSession(config, code);

  const refreshToken = async (
    refreshToken: string,
  ): Promise<Session | ErrorResponse> => {
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
    return JSON.parse(text) as Session;
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

const localRedirectUrl = (path: string): string => {
  return window?.location?.origin ? `${window.location.origin}${path}` : path;
};

export const internalExchangeTokenForSession = async (
  config: Config,
  code: string,
): Promise<Session | ErrorResponse> => {
  const redirectUri = encodeURI(localRedirectUrl(config.loginCallbackPath()));
  const formData = new FormData();
  formData.append("code", code);
  formData.append("redirect_uri", redirectUri);
  const res = await fetch(config.apiUrl(config.tokenPath()), {
    method: "POST",
    body: formData,
  });

  const text = await res.text();
  return JSON.parse(text) as Session;
};
