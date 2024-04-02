import { OIDCStrategy, SAMLStrategy } from "@core/strategies/sso";
import { MinitailorStrategy } from "@core/strategies/minitailor";
import { AbstractStrategy } from "@core/strategies/abstract";
import { defaultStrategy } from "@core/strategies/default";

type ContextConfig = {
  /**
   * Your own Tailor Platform app host (e.g. "http://yourapp.mini.tailor.tech:8000")
   */
  apiHost: string;

  /**
   * Your own frontend app host (e.g. "http://localhost:3000")
   */
  appHost: string;

  /**
   * Set the Secure attribute on cookies (default: true)
   */
  secure: boolean;

  /**
   * Auth service endpoint to initiate login (default: /auth/login)
   */
  loginPath: string;

  /**
   * Path to be redirected if not authorized (default: /unauthorized)
   */
  unauthorizedPath: string;

  /**
   * Auth service endpoint to issue a session token (default: /auth/token)
   */
  tokenPath: string;

  /**
   * Auth service refresh token endpoint (default: /auth/token/refresh)
   */
  refreshTokenPath: string;

  /**
   * Auth service endpoint to fetch the user information (default: /auth/userinfo)
   */
  userInfoPath: string;
};

export const NoCorrespondingStrategyError = new Error(
  "no corresponding authentication strategy available",
);

/**
 * Class that encapsulates the configuration for the auth package.
 *
 * @example
 * ```
 * import { Config } from "@tailor-platform/auth/core";
 *
 * export const config = new Config({
 *  apiHost: "http://yourapp.mini.tailor.tech:8000",
 *  appHost: "http://localhost:3000",
 * });
 * ```
 */
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
