import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { Config, Session } from "@client";
import { internalClientSessionPath } from "@server/middleware/internal";

export const mockSession: Session = {
  access_token: "mockAccessToken",
  refresh_token: "mockRefreshToken",
  expires_in: 86400,
  user_id: "43a05b99-ebe1-4b89-8284-e4447e3a3551",
};

const defaultMockResponse = {
  token: () => HttpResponse.json(mockSession),
  userinfo: () =>
    HttpResponse.json({
      sub: "mockSub",
    }),
  refreshToken: () =>
    HttpResponse.json({
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
    }),
  clientSession: () =>
    HttpResponse.json({
      token: "mockAccessToken",
    }),
};

export const mockAuthConfigValue = {
  apiHost: "https://mock-api-url.com",
  appHost: "http://localhost:3000",
  loginPath: "/mock-login",
  loginCallbackPath: "/mock-callback",
  tokenPath: "/mock-token",
  refreshTokenPath: "/mock-refresh-token",
  userInfoPath: "/mock-userinfo",
};
export const mockAuthConfig = new Config(mockAuthConfigValue);
export const buildMockServer = (response?: typeof defaultMockResponse) => {
  const mockResponse = {
    ...defaultMockResponse,
    ...response,
  };

  return setupServer(
    http.post(mockAuthConfig.apiUrl(mockAuthConfig.tokenPath()), () =>
      mockResponse.token(),
    ),
    http.get(mockAuthConfig.apiUrl(mockAuthConfig.userInfoPath()), () =>
      mockResponse.userinfo(),
    ),
    http.post(mockAuthConfig.apiUrl(mockAuthConfig.refreshTokenPath()), () =>
      mockResponse.refreshToken(),
    ),
    http.get(mockAuthConfig.appUrl(internalClientSessionPath), () =>
      mockResponse.clientSession(),
    ),
  );
};
