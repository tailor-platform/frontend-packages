import { ErrorResponse, Session, UserInfo } from "@lib/types";
import { useTailorOidc } from "@lib/provider";

export const useTailorOidcUtils = () => {
  const config = useTailorOidc();

  const makeApiUrl = (path: string): string => `${config.apiUrl}${path}`;

  const localRedirectUrl = (path: string): string => {
    return window?.location?.origin ? `${window.location.origin}${path}` : path;
  };

  const makeLoginUrl = (path: string): string => {
    const apiLoginUrl = makeApiUrl(config.loginPath);
    const callbackPath = config.loginCallbackPath;
    const redirectUrl = encodeURI(
      `${localRedirectUrl(callbackPath)}?redirect_uri=${path}`,
    );
    return `${apiLoginUrl}?redirect_uri=${redirectUrl}`;
  };

  const exchangeTokenForSession = async (
    code: string,
  ): Promise<Session | ErrorResponse> => {
    const tokenPath = config.tokenPath;
    const redirectUri = encodeURI(localRedirectUrl(config.loginCallbackPath));
    const formData = new FormData();
    formData.append("code", code);
    formData.append("redirect_uri", redirectUri);
    const res = await fetch(makeApiUrl(tokenPath), {
      method: "POST",
      body: formData,
    });

    const text = await res.text();
    return JSON.parse(text) as Session;
  };

  const refreshToken = async (
    refreshToken: string,
  ): Promise<Session | ErrorResponse> => {
    const refreshTokenPath = config.refreshTokenPath;
    const formData = new FormData();
    formData.append("refresh_token", refreshToken);
    const res = await fetch(makeApiUrl(refreshTokenPath), {
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
    const userInfoPath = config.userInfoPath;
    const res = await fetch(makeApiUrl(userInfoPath), {
      method: "GET",
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
