import { NextMiddleware } from "next/server";
import { NextResponse } from "next/server";
import {
  Config,
  clientSessionPath,
  internalUnauthorizedPath,
} from "@/lib/config";
import { Session } from "@/lib/types";
import { internalExchangeTokenForSession } from "@lib/core";

type Options = {
  prepend?: (args: { token: string; userID: string }) => Promise<void> | void;
  onError?: (err: Error) => Promise<void> | void;
};

export const withAuth = (
  config: Config,
  options?: Options,
  middlware?: NextMiddleware,
): NextMiddleware => {
  return async (request, event) => {
    const nextURL = request.nextUrl;
    if (nextURL.pathname.startsWith(config.loginCallbackPath())) {
      const result = await handleCallback(
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
  };
};

export class CallbackError extends Error {
  constructor(
    readonly name: string,
    readonly message: string,
  ) {
    super(message);
  }
}

export const paramsError = () =>
  new CallbackError("invalid-params", "code and redirectURI should be filled");
export const exchangeError = (reason: string) =>
  new CallbackError("failed-exchange", reason);

export const handleCallback = async (
  params: URLSearchParams,
  config: Config,
  options?: Options,
) => {
  try {
    const code = params.get("code");
    const redirectURI = params.get("redirect_uri");
    if (!code || !redirectURI) {
      throw paramsError();
    }

    const session = await internalExchangeTokenForSession(config, code);
    if ("error" in session) {
      throw exchangeError(session.error);
    }
    options?.prepend &&
      (await options.prepend({
        token: session.access_token,
        userID: session.user_id,
      }));

    const redirection = NextResponse.redirect(config.appUrl(redirectURI));
    redirection.cookies.set(
      buildCookieEntry(session, "tailor.token", "access_token"),
    );
    return redirection;
  } catch (e: unknown) {
    if (e instanceof Error && options?.onError) {
      await options.onError(e);
    }
  }
};

const buildCookieEntry = <const T extends keyof Session>(
  session: Session,
  name: string,
  value: T,
) => {
  // Use `expires_in` field from Tailor Platform auth service which comes as seconds
  const expires = session.expires_in * 1000;

  // Use the strictest cookie here
  return {
    name,
    value: session[value],
    sameSite: "strict" as const,
    httpOnly: true,
    secure: true,
    expires,
  };
};
