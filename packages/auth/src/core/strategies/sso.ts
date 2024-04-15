import { AbstractStrategy } from "./abstract";
import { Config } from "@core/config";
import { callbackByStrategy } from "@core/path";
import { paramsError } from "@server/middleware/callback";

export type Options = { redirectPath: string };

// `ssoStrategyBuilder` is a function to define SSO related strategy dynamically
// Currently, this builder aims to support OIDC and SAML
export const ssoStrategyBuilder = (name: string, paramName: string) => {
  return class SSOStrategy implements AbstractStrategy<Options> {
    name() {
      return name;
    }

    authenticate(config: Config, options: Options) {
      const apiLoginUrl = config.apiUrl(config.loginPath());
      const callbackPath = callbackByStrategy(this.name());
      const redirectUrl = encodeURI(
        `${config.appUrl(callbackPath)}?redirect_uri=${options.redirectPath ?? "/"}`,
      );

      return {
        mode: "redirection" as const,
        uri: `${apiLoginUrl}?redirect_uri=${redirectUrl}`,
      };
    }

    callback(config: Config, searchParams: URLSearchParams) {
      const param = searchParams.get(paramName);
      const redirectURI = searchParams.get("redirect_uri");
      if (!param || !redirectURI) {
        throw paramsError();
      }

      const redirectUri = encodeURI(
        config.appUrl(callbackByStrategy(this.name())),
      );
      const payload = new FormData();
      payload.append(paramName, param);
      payload.append("redirect_uri", redirectUri);
      return {
        payload,
        redirectUri: redirectURI,
      };
    }
  };
};

export const OIDCStrategy = ssoStrategyBuilder("oidc", "code");
export const SAMLStrategy = ssoStrategyBuilder("saml", "SAMLResponse");
