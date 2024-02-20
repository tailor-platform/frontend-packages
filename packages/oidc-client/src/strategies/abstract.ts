import { Config } from "@lib/config";

type CallbackResult = {
  payload: FormData;
  redirectUri: string;
};
type AuthenticateResult<R = unknown> =
  | {
      // Redirection-base authentication flow (eg. OIDC/SAML/...)
      mode: "redirection";

      // Uri is a destination to be redirected
      uri: string;
    }
  | {
      // Function-based authentication flow (eg. Firebase SDK/AWS Cognite JS SDK/...)
      mode: "function-call";

      // Callback is a function expected to be executed in `login` function
      result: R;
    };

export type AbstractStrategy<
  T extends Record<string, unknown> = Record<string, unknown>,
  R = unknown,
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
  ): Promise<AuthenticateResult<R>> | AuthenticateResult<R>;
};
