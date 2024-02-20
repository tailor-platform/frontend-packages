import { Config } from "@lib/config";

type CallbackResult = {
  payload: FormData;
  redirectUri: string;
};
type AuthenticateResult =
  | {
      // Redirection-base authentication flow (eg. OIDC/SAML/...)
      mode: "redirection";

      // Uri is a destination to be redirected
      uri: string;
    }
  | {
      // Manually calling callback
      mode: "manual-callback";

      // Payload to be sent to callback handler
      payload: FormData;
    };

export type AbstractStrategy<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  // Name should return the name of strategy.
  // The value returned from this will be used as identifier in middleware callback
  name(): string;

  // Callback is a function to be handled in a callback handler in middleware.
  callback(config: Config, params: URLSearchParams): CallbackResult;

  // Authenticate is expected to tell if authentication flow is redirection or function-call.
  authenticate(
    config: Config,
    options: T,
  ): Promise<AuthenticateResult> | AuthenticateResult;
};
