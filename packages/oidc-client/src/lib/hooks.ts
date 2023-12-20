import { ErrorResponse, Session, UserInfo } from "@lib/types";
import { useTailorOidc } from "@lib/provider";

export const useTailorOidcUtils = () => {
  const config = useTailorOidc();

  const makeApiUrl = (path: string): string => `${config.apiUrl}${path}`;

  const localRedirectUrl = (path: string): string => {
    return window?.location?.origin ? `${window.location.origin}${path}` : path;
  };

  const makeLoginUrl = (path: string): string => {
    const apiLoginUrl = makeApiUrl(config.oidcLoginPath);
    const callbackPath = config.oidcLoginCallbackPath;
    const redirectUrl = encodeURI(
      `${localRedirectUrl(callbackPath)}?redirect_uri=${path}`,
    );
    return `${apiLoginUrl}?redirect_uri=${redirectUrl}`;
  };

  const exchangeTokenForSession = async (
    code: string,
  ): Promise<Session | ErrorResponse> => {
    const tokenPath = config.oidcTokenPath;
    const redirectUri = encodeURI(
      localRedirectUrl(config.oidcLoginCallbackPath),
    );
    const formData = new FormData();
    formData.append("code", code);
    formData.append("redirect_uri", redirectUri);
    try {
      const res = await fetch(makeApiUrl(tokenPath), {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      return JSON.parse(text) as Session;
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : "" };
    }
  };

  const refreshToken = async (
    refreshToken: string,
  ): Promise<Session | ErrorResponse> => {
    const refreshTokenPath = config.oidcRefreshTokenPath;
    const formData = new FormData();
    formData.append("refresh_token", refreshToken);
    try {
      const res = await fetch(makeApiUrl(refreshTokenPath), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `refresh_token=${encodeURIComponent(refreshToken)}`,
      });

      const text = await res.text();
      return JSON.parse(text) as Session;
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : "" };
    }
  };

  const getLoggedInPlatformUser = async (
    token: string,
  ): Promise<UserInfo | ErrorResponse> => {
    const userInfoPath = config.oidcUserInfoPath;
    try {
      const res = await fetch(makeApiUrl(userInfoPath), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const text = await res.text();
      return JSON.parse(text) as UserInfo;
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : "" };
    }
  };

  return {
    makeLoginUrl,
    exchangeTokenForSession,
    refreshToken,
    getLoggedInPlatformUser,
  };
};
