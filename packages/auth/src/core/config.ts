import { OIDCStrategy } from "@core/strategies/oidc";
import { SAMLStrategy } from "@core/strategies/saml";
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
 *
 * Each of these properties in `config` to specific environment variables or constants you need to define in your application's environment.
 *
 * Collectively, they form the configuration necessary for the client to handle user authentication in a standardized manner.
 *
 * | Name             | Required | Description                                           | Default               |
 * | ---------------- | -------- | ----------------------------------------------------- | --------------------- |
 * | apiHost          | Yes      | Tailor Platform host                                  |                       |
 * | appHost          | Yes      | Frontend app host                                     |                       |
 * | unauthorizedPath |          | Path to be redirected if not authorized               | `/unauthorized`       |
 * | loginPath        |          | Auth service endpoint to initiate login               | `/auth/login`         |
 * | tokenPath        |          | Auth service endpoint to issue a session token        | `/auth/token`         |
 * | refreshTokenPath |          | Auth service refresh token endpoint                   | `/auth/token/refresh` |
 * | userInfoPath     |          | Auth service endpoint to fetch basic user information | `/auth/userinfo`      |
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

  /**
   * @internal
   */
  getStrategy(name?: string) {
    const strategyName = name || defaultStrategy.name();
    const strategy = this.strategyMap.get(strategyName);
    if (!strategy) {
      throw NoCorrespondingStrategyError;
    }
    return strategy;
  }

  /**
   * @internal
   */
  getStrategyNames() {
    return Array.from(this.strategyMap.keys());
  }

  /**
   * @internal
   */
  apiUrl(path: string) {
    return this.params.apiHost + path;
  }

  /**
   * @internal
   */
  appUrl(path: string) {
    return this.params.appHost + path;
  }

  /**
   * @internal
   */
  loginPath() {
    return this.params.loginPath || "/auth/login";
  }

  /**
   * @internal
   */
  unauthorizedPath() {
    return this.params.unauthorizedPath || "/unauthorized";
  }

  /**
   * @internal
   */
  tokenPath() {
    return this.params.tokenPath || "/auth/token";
  }

  /**
   * @internal
   */
  refreshTokenPath() {
    return this.params.refreshTokenPath || "/auth/token/refresh";
  }

  /**
   * @internal
   */
  userInfoPath() {
    return this.params.userInfoPath || "/auth/userinfo";
  }

  /**
   * @internal
   */
  secure() {
    return this.params.secure !== false;
  }
}
