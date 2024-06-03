import { Config } from "@core/config";

export type CallbackResult = {
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
 *
 * @example
 * Users can implement their own custom authentication by writing custom strategies. See [src/strategies/abstract.ts](src/strategies/abstract.ts) to know interfaces expected to be implemented.
 * ```
 * import { AbstractStrategy } from "@tailor-platform/auth/core";
 *
 * type Option = {
 *   email: string;
 *   password: string;
 * };
 *
 * export class YourOwnAuthenticationStrategy
 *   implements AbstractStrategy<Options>
 * {
 *   name() {
 *     return "your-own-strategy";
 *   }
 *
 *   authenticate(config: Config, options: Options) {
 *     // Implement authentication here
 *     // Here will be executed on client components by `login` function in useAuth hook
 *     // (See `AuthenticateResult` type to know what this function is required to return)
 *   }
 *
 *   callback(config: Config, params: URLSearchParams) {
 *     // Implement callback process here
 *     // Here will be executed in server side as a part of Next.js middleware
 *     // (See `CallbackResult` type to know what this function is required to return)
 *   }
 * }
 * ```
 *
 * @example
 * Custom strategies can be plugged into your configuration.
 * ```
 * export const config = new Config(
 *   {
 *     // your configurations here...
 *   },
 *   [new YourOwnAuthenticationStrategy()],
 * );
 * ```
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
  callback(
    config: Config,
    request: Request,
  ): CallbackResult | Promise<CallbackResult>;
};

export class CallbackError extends Error {
  constructor(
    readonly code: string,
    readonly message: string,
  ) {
    super(message);
    this.name = "CallbackError";
  }
}

export const oidcParamsError = () =>
  new CallbackError(
    "oidc-invalid-params",
    "code and redirectURI should be filled",
  );
export const samlParamsError = () =>
  new CallbackError("saml-invalid-params", "SAMLResponse should be filled");
export const minitailorParamsError = () =>
  new CallbackError(
    "minitailor-invalid-params",
    "idToken and redirectURI should be filled",
  );
export const minitailorTokenError = (code: number) =>
  new CallbackError(
    "minitailor-token-error",
    `failed to obtain token (status=${code})`,
  );

/** @deprecated for backward compatibility use **Error */
export const paramsError = () =>
  new CallbackError("invalid-params", "params should be filled");
export const exchangeError = (reason: string) =>
  new CallbackError("failed-exchange", reason);
