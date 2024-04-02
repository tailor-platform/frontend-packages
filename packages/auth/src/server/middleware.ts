import { NextMiddleware, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { callbackHandler } from "./middleware/callback";
import {
  internalCallbackPath,
  internalClientSessionHandler,
  internalClientSessionPath,
  internalLogoutHandler,
  internalLogoutPath,
  internalUnauthorizedPath,
  internalUnauthroziedHandler,
} from "./middleware/internal";
import { Config } from "@core/config";

export type MiddlewareHandlerOptions = {
  /**
   * A callback handler to prepend you own logic just after the token is issued.
   * (eg. fetch user profile and store it in LocalStorage, ...)
   */
  prepend?: (args: { token: string; userID: string }) => Promise<void> | void;
};

type WithAuthOptions = MiddlewareHandlerOptions & {
  /**
   * An error handler to be called when an error occurs in the middleware.
   */
  onError?: (err: Error) => Promise<void> | void;
};

/**
 * A middleware that mainly intercepts requests to login callback from IDP or login process
 * by automatically generating a callback handler to accept redirection from IDP as `__auth/callback/{strategy}` path.
 *
 * For instance, if you are using OIDC strategy, the path you have to add in the whitelist on IDP dashboard will be `__auth/callback/oidc`.
 *
 * @example
 * ```
 * import { withAuth } from "@tailor-platform/auth/server";
 * import { config as authConfig } from "@/libs/authConfig";
 *
 * const middleware: unknown = withAuth(
 *   authConfig,
 *   {
 *     prepend: ({ token }) => {
 *       // Do something you want with token here
 *       // (eg. fetch user profile and store it in LocalStorage, ...)
 *     },
 *     onError: (e: Error) => {
 *       // Handle an error in authorization callback here
 *       // Use `NextResponse.redirect` to redirect your own error page or somewhere.
 *     },
 *   },
 *   (request, event) => {
 *     // Add middlewares here if you want to chain more of them
 *   },
 * );
 *
 * export default middleware;
 * ```
 */
export const withAuth =
  (
    config: Config,
    options?: WithAuthOptions,
    middleware?: NextMiddleware,
  ): NextMiddleware =>
  async (request, event) =>
    middlewareRouter(
      { request, config, options },
      {
        // Add middleware routes here
        [internalCallbackPath]: callbackHandler,
        [internalClientSessionPath]: internalClientSessionHandler,
        [internalUnauthorizedPath]: internalUnauthroziedHandler,
        [internalLogoutPath]: internalLogoutHandler,
      },
      async () => {
        await middleware?.(request, event);
      },
    );

type RouterParams = {
  request: NextRequest;
  config: Config;
  options?: WithAuthOptions;
};

export type RouteHandler = (
  // Removing `options` field here is because it accepts `onError` callback,
  // but calling onError should only be middlewareRouter itself for simplicity,
  // not in each middleware handler.
  params: Omit<RouterParams, "options"> & {
    options?: MiddlewareHandlerOptions;
  },
) => Promise<NextResponse<unknown> | undefined> | NextResponse<unknown>;

// Curved out routing responsibility from withAuth middleware
// This also helps us free from mocking NextFetchEvent (used in NextMiddleware) that is hard to mock
export const middlewareRouter = async (
  params: RouterParams,
  routes: Record<string, RouteHandler>,
  fallback?: () => Promise<void>,
) => {
  const { request, options } = params;

  try {
    const routeKey = Object.keys(routes).find((route) =>
      request.nextUrl.pathname.startsWith(route),
    );

    if (routeKey) {
      const handler = routes[routeKey];
      return await handler({
        request,
        config: params.config,
        options: params.options,
      });
    }

    await fallback?.();
  } catch (e: unknown) {
    if (e instanceof Error && options?.onError) {
      await options.onError(e);
      return NextResponse.next();
    }
  }
};
