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
    const redirectUrl = encodeURI(config.appUrl(callbackPath));
    const relayState = encodeURI(options.redirectPath ?? "/");
    return {
      mode: "redirection" as const,
      uri: `${apiLoginUrl}?redirect_uri=${redirectUrl}&state=${relayState}`,
    };
  }

  async callback(config: Config, request: Request) {
    const formData = await request.formData();
    const samlResponse = formData.get("SAMLResponse");
    const relayState = formData.get("RelayState");

    // RelayState will be optional in IDP initiated SAML flow
    if (!samlResponse) {
      throw samlParamsError();
    }

    const callbackUrl = callbackByStrategy(this.name());
    const redirectUri = encodeURI(`${config.appUrl(callbackUrl)}`);
    const payload = new FormData();
    payload.append("SAMLResponse", samlResponse);
    payload.append("redirect_uri", redirectUri);

    return {
      payload,
      redirectUri: relayState ?? "/",
    } as CallbackResult;
  }
}
