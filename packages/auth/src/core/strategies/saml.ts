import {
  AbstractStrategy,
  CallbackResult,
  samlParamsError,
} from "@core/strategies/abstract";
import { Config } from "@core/config";
import { callbackByStrategy } from "@core/path";

export type Options = { redirectPath: string };

export class SAMLStrategy implements AbstractStrategy<Options> {
  name() {
    return "saml";
  }

  authenticate(config: Config, options: Options) {
    const apiLoginUrl = config.apiUrl(config.loginPath());
    const callbackPath = callbackByStrategy(this.name());
    const redirectUrl = encodeURI(
      `${config.appUrl(callbackPath)}?redirect_uri=${options.redirectPath ?? "/"}`,
    );
    const relayState = encodeURI(options.redirectPath ?? "/");
    return {
      mode: "redirection" as const,
      uri: `${apiLoginUrl}?redirect_uri=${redirectUrl}&state=${relayState}`,
    };
  }

  async callback(config: Config, request: Request) {
    const formData = await request.formData();
    const samlResponse = formData.get("SAMLResponse");
    const readyState = formData.get("RelayState");
    if (!samlResponse || !readyState) {
      throw samlParamsError();
    }

    const callbackUrl = callbackByStrategy(this.name());
    const redirectUri = encodeURI(`${config.appUrl(callbackUrl)}`);
    const payload = new FormData();
    payload.append("SAMLResponse", samlResponse);
    payload.append("redirect_uri", redirectUri);

    return {
      payload,
      redirectUri: readyState ?? "/",
    } as CallbackResult;
  }
}
