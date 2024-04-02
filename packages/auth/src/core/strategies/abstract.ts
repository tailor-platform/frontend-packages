import { Config } from "@core/config";

type CallbackResult = {
  /**
   * Payload to be sent out to /auth/token endpoint on Tailor Platform to issue token
   */
  payload: FormData;

  /**
   * An URI to be redirected after callback handler
   */
  redirectUri: string;
};

/**
 * `AuthenticateResult` is a type that is returned from `authenticate` function in `AbstractStrategy`
 * to decide the authentication process that the strategy will take.
 */
type AuthenticateResult =
  | {
      /**
       * Redirection-base authentication flow (eg. OIDC/SAML/...)
       */
      mode: "redirection";

      /**
       * A destination URI to be redirected
       */
      uri: string;
    }
  | {
      /**
       * Manually sending out the content in `payload` above to middleware callback handlers.
       */
      mode: "manual-callback";

      /**
       * Payload to be sent to callback handler
       */
      payload: Record<string, string>;
    };

/**
 * AbstractStrategy is an interface that all authentication strategies are expected to implement
 */
export type AbstractStrategy<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  /**
   * `name` function returns the name of strategy.
   *
   * @returns an strategy identifier used in middleware callback
   */
  name(): string;

  /**
   * `authenticate` is a function that is called when users initiate authentication process with `login` function on client components
   *
   * @returns `AuthenticationResult` object to tell if authentication flow is redirection or manual callback.
   */
  authenticate(
    config: Config,
    options: T,
  ): Promise<AuthenticateResult> | AuthenticateResult;

  /**
   * `callback` is a function to be handled in a callback handler in middleware.
   *
   * @returns `CallbackResult` object that contains payload to be sent to /auth/token endpoint to issue token
   */
  callback(config: Config, params: URLSearchParams): CallbackResult;
};
