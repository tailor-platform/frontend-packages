import { AbstractStrategy, paramsError } from "@core/strategies/abstract";
import { Config } from "@core/config";
import { callbackByStrategy } from "@core/path";

export type Options = { redirectPath: string };

export class OIDCStrategy implements AbstractStrategy<Options> {
  name() {
    return "oidc";
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

  callback(config: Config, request: Request) {
    const searchParams = new URL(request.url).searchParams;
    const param = searchParams.get("code");
    const redirectURI = searchParams.get("redirect_uri");
    if (!param || !redirectURI) {
      throw paramsError();
    }

    const redirectUri = encodeURI(
      config.appUrl(callbackByStrategy(this.name())),
    );
    const payload = new FormData();
    payload.append("code", param);
    payload.append("redirect_uri", redirectUri);
    return {
      payload,
      redirectUri: redirectURI,
    };
  }
}
