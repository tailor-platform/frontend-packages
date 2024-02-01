import { Config } from "@client";

export const mockAuthConfig = new Config({
  apiHost: "https://mock-api-url.com",
  appHost: "http://localhost:3000",
  loginPath: "/mock-login",
  loginCallbackPath: "/mock-callback",
  tokenPath: "/mock-token",
  refreshTokenPath: "/mock-refresh-token",
  userInfoPath: "/mock-userinfo",
});
