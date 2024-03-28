import { OIDCStrategy, SAMLStrategy } from "@core/strategies/sso";
import { MinitailorStrategy } from "@core/strategies/minitailor";
import { AbstractStrategy } from "@core/strategies/abstract";
import { defaultStrategy } from "@core/strategies/default";

type ContextConfig = {
  apiHost: string;
  appHost: string;

  /*!
   * A flag to enable secure cookies or not (default: true)
   */
  secure: boolean;

  /*!
   * Auth service endpoint to initiate login (default: /auth/login)
   */
  loginPath: string;

  /*!
   * Path to be redirected if not authorized (default: /unauthorized)
   */
  unauthorizedPath: string;

  /*!
   * Auth service endpoint to issue a session token (default: /auth/token)
   */
  tokenPath: string;

  /*!
   * Auth service refresh token endpoint (default: /auth/token/refresh)
   */
  refreshTokenPath: string;

  /*!
   * Auth service endpoint to fetch basic user information (default: /auth/userinfo)
   */
  userInfoPath: string;
};

export const NoCorrespondingStrategyError = new Error(
  "no corresponding authentication strategy available",
);

export class Config {
  private readonly strategyMap: Map<string, AbstractStrategy>;

  // Only "apiUrl" and "appHost" should be required
  constructor(
    private readonly params: Pick<ContextConfig, "apiHost" | "appHost"> &
      Partial<ContextConfig>,
    private readonly strategies: Array<AbstractStrategy> = [
      defaultStrategy,
      new MinitailorStrategy(),
      new OIDCStrategy(),
      new SAMLStrategy(),
    ],
  ) {
    this.strategyMap = new Map();
    strategies.forEach((strategy) => {
      this.strategyMap.set(strategy.name(), strategy);
    });
  }

  getStrategy(name?: string) {
    const strategyName = name || defaultStrategy.name();
    const strategy = this.strategyMap.get(strategyName);
    if (!strategy) {
      throw NoCorrespondingStrategyError;
    }
    return strategy;
  }

  getStrategyNames() {
    return Array.from(this.strategyMap.keys());
  }

  apiUrl(path: string) {
    return this.params.apiHost + path;
  }

  appUrl(path: string) {
    return this.params.appHost + path;
  }

  loginPath() {
    return this.params.loginPath || "/auth/login";
  }

  unauthorizedPath() {
    return this.params.unauthorizedPath || "/unauthorized";
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

  secure() {
    return this.params.secure !== false;
  }
}
