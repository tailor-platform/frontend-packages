import { NextMiddleware } from "next/server";
import { NextResponse } from "next/server";
import { Config, clientSessionPath } from "@/lib/config";
import { internalExchangeTokenForSession } from "@lib/core";

type Callbacks = {
  prepend: (args: { token: string; userID: string }) => Promise<void> | void;
};

export const withAuth = (
  config: Config,
  callbacks?: Callbacks,
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
      const token = session.access_token;
      const userID = session.user_id;
      callbacks?.prepend && (await callbacks.prepend({ token, userID }));

      const redirection = NextResponse.redirect(config.appUrl(redirectURI));
      redirection.cookies.set({
        name: "tailor.token",
        value: token,
        sameSite: "strict",
        httpOnly: true,
      });
      redirection.cookies.set({
        name: "tailor.userid",
        value: userID,
        sameSite: "strict",
        httpOnly: true,
      });
      return redirection;
    } else if (nextURL.pathname.startsWith(clientSessionPath)) {
      const tailorToken = request.cookies.get("tailor.token");
      return NextResponse.json({ token: tailorToken?.value });
    }

    await middlware?.(request, event);
  };
};
