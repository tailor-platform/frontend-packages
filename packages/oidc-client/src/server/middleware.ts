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
  prepend: (args: { token: string; userID: string }) => Promise<void> | void;
};

export const withAuth = (
  config: Config,
  options?: Options,
  middlware?: NextMiddleware,
): NextMiddleware => {
  return async (request, event) => {
    const nextURL = request.nextUrl;
    if (nextURL.pathname.startsWith(config.loginCallbackPath())) {
      const code = nextURL.searchParams.get("code");
      const redirectURI = nextURL.searchParams.get("redirect_uri");
      if (!code || !redirectURI) {
        // TODO: passing error reason with error code
        return NextResponse.redirect(config.appUrl(config.unauthorizedPath()));
      }

      const session = await internalExchangeTokenForSession(config, code);
      if ("error" in session) {
        // TODO: passing error reason with error code
        return NextResponse.redirect(config.appUrl(config.unauthorizedPath()));
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
    } else if (nextURL.pathname.startsWith(clientSessionPath)) {
      const tailorToken = request.cookies.get("tailor.token");
      return NextResponse.json({ token: tailorToken?.value });
    } else if (nextURL.pathname.startsWith(internalUnauthorizedPath)) {
      return NextResponse.redirect(config.appUrl(config.unauthorizedPath()));
    }

    await middlware?.(request, event);
  };
};

const buildCookieEntry = <const T extends keyof Session>(
  session: Session,
  name: string,
  value: T,
) => {
  // `expires_in` comes as seconds
  const expires = session.expires_in * 1000;

  return {
    name,
    value: session[value],
    sameSite: "strict" as const,
    httpOnly: true,
    secure: true,
    expires,
  };
};
