import { Config, Session } from "@client";

export const mockSession: Session = {
  access_token: "mockAccessToken",
  refresh_token: "mockRefreshToken",
  expires_in: 86400,
  user_id: "43a05b99-ebe1-4b89-8284-e4447e3a3551",
};

export const mockAuthConfig = new Config({
  apiHost: "https://mock-api-url.com",
  appHost: "http://localhost:3000",
  loginPath: "/mock-login",
  loginCallbackPath: "/mock-callback",
  tokenPath: "/mock-token",
  refreshTokenPath: "/mock-refresh-token",
  userInfoPath: "/mock-userinfo",
});
