import { OIDCStrategy } from "./sso";

// `defaultStrategy` is a strategy used if users don't specify the strategy name in `login` function
// Currently, the default is OIDC, but fine to be changed in need.
export const defaultStrategy = new (class extends OIDCStrategy {
  name() {
    return "default";
  }
})();
