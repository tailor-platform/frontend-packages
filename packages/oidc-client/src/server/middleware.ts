import { NextMiddleware } from "next/server";
import { NextResponse } from "next/server";
import { callbackHandler } from "./middleware/callback";
import {
  Config,
  clientSessionPath,
  internalUnauthorizedPath,
} from "@/lib/config";

export type MiddlewareHandlerOptions = {
  prepend?: (args: { token: string; userID: string }) => Promise<void> | void;
};

type Options = MiddlewareHandlerOptions & {
  onError?: (err: Error) => Promise<void> | void;
};

export const withAuth = (
  config: Config,
  options?: Options,
  middlware?: NextMiddleware,
): NextMiddleware => {
  return async (request, event) => {
    try {
      const nextURL = request.nextUrl;
      if (nextURL.pathname.startsWith(config.loginCallbackPath())) {
        const result = await callbackHandler(
          request.nextUrl.searchParams,
          config,
          options,
        );
        if (result instanceof NextResponse) {
          return result;
        }
      } else if (nextURL.pathname.startsWith(clientSessionPath)) {
        const tailorToken = request.cookies.get("tailor.token");
        return NextResponse.json({ token: tailorToken?.value });
      } else if (nextURL.pathname.startsWith(internalUnauthorizedPath)) {
        return NextResponse.redirect(config.appUrl(config.unauthorizedPath()));
      }
      await middlware?.(request, event);
    } catch (e: unknown) {
      if (e instanceof Error && options?.onError) {
        await options.onError(e);
      }
    }
  };
};
