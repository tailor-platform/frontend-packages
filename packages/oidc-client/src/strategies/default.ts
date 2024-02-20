import { paramsError } from "@server/middleware/callback";
import { Config } from "@lib/config";
import { AbstractStrategy, AuthenticateFlow } from "@strategies/abstract";

type Options = { redirectPath: string };

export class DefaultStrategy implements AbstractStrategy<Options> {
  name() {
    return "default";
  }

  authenticate(config: Config, options: Options): AuthenticateFlow {
    const apiLoginUrl = config.apiUrl(config.loginPath());
    const callbackPath = config.loginCallbackPath();
    const redirectUrl = encodeURI(
      `${config.appUrl(callbackPath)}?redirect_uri=${options.redirectPath ?? "/"}`,
    );

    return {
      mode: "redirection",
      uri: `${apiLoginUrl}?redirect_uri=${redirectUrl}`,
    };
  }

  callback(config: Config, params: URLSearchParams) {
    const code = params.get("code");
    const redirectURI = params.get("redirect_uri");
    if (!code || !redirectURI) {
      throw paramsError();
    }

    const redirectUri = encodeURI(config.appUrl(config.loginCallbackPath()));
    const payload = new FormData();
    payload.append("code", code);
    payload.append("redirect_uri", redirectUri);
    return {
      payload,
      redirectUri: redirectURI,
    };
  }
}
