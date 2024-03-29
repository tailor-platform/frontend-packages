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
  prepend?: (args: { token: string; userID: string }) => Promise<void> | void;
};

type WithAuthOptions = MiddlewareHandlerOptions & {
  onError?: (err: Error) => Promise<void> | void;
};

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
