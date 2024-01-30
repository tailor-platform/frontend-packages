import { ContextConfig } from "./provider";

export class Config {
  // Only "apiUrl" should be required
  constructor(
    private readonly params: Pick<ContextConfig, "apiUrl"> &
      Partial<ContextConfig>,
  ) {}

  apiUrl() {
    return this.params.apiUrl;
  }

  loginPath() {
    return this.params.loginPath || "/auth/login";
  }

  loginCallbackPath() {
    return this.params.loginCallbackPath || "/login/callback";
  }

  tokenPath() {
    return this.params.tokenPath || "/auth/token";
  }

  refreshTokenPath() {
    return this.params.refreshTokenPath || "/auth/token/refresh";
  }

  userInfoPath() {
    return this.params.userInfoPath || "/auth/userinfo";
  }
}
