import { Config } from "@lib/config";

type CallbackResult = {
  // Payload to be sent out to /auth/token endpoint on Tailor Platform to issue token
  payload: FormData;

  // An URI to be redirected after callback handler
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
      // This mode will manually send out the payload above to middleware callback handlers.
      mode: "manual-callback";

      // Payload to be sent to callback handler
      payload: FormData;
    };

// AbstractStrategy is an interface that all authentication strategies are expected to implement
export type AbstractStrategy<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  // Name should return the name of strategy.
  // The value returned from this will be used as identifier in middleware callback
  name(): string;

  // Authenticate is a function that runs when users trigger `login` function on client components
  // The returned value tells if authentication flow is redirection or manual callback.
  authenticate(
    config: Config,
    options: T,
  ): Promise<AuthenticateResult> | AuthenticateResult;

  // Callback is a function to be handled in a callback handler in middleware.
  callback(config: Config, params: URLSearchParams): CallbackResult;
};
