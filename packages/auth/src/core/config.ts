import { OIDCStrategy, SAMLStrategy } from "./strategies/sso";
import { MinitailorStrategy } from "./strategies/minitailor";
import { AbstractStrategy } from "@core/strategies/abstract";

type ContextConfig = {
  apiHost: string;
  appHost: string;
  loginPath: string;
  unauthorizedPath: string;
  loginCallbackPath: string;
  tokenPath: string;
  refreshTokenPath: string;
  userInfoPath: string;
};

// `defaultStrategy` is a strategy used if users don't specify the strategy name in `login` function
// Currently, the default is OIDC, but fine to be changed in need.
export const defaultStrategy = new (class extends OIDCStrategy {
  name() {
    return "default";
  }
})();

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

  getStrategy(name: string) {
    return this.strategyMap.get(name);
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

  loginCallbackPath(strategy: string = defaultStrategy.name()) {
    return this.params.loginCallbackPath || `/login/callback/${strategy}`;
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
