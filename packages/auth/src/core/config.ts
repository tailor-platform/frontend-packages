import { OIDCStrategy, SAMLStrategy } from "@core/strategies/sso";
import { MinitailorStrategy } from "@core/strategies/minitailor";
import { AbstractStrategy } from "@core/strategies/abstract";
import { defaultStrategy } from "@core/strategies/default";

type ContextConfig = {
  apiHost: string;
  appHost: string;
  loginPath: string;
  unauthorizedPath: string;
  loginCallbackPath: string;
  tokenPath: string;
  refreshTokenPath: string;
  userInfoPath: string;
  secure: boolean;
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

  loginCallbackPath(strategy?: string) {
    const basePath = this.params.loginCallbackPath || `/login/callback`;
    return strategy ? `${basePath}/${strategy}` : basePath;
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
