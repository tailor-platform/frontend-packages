import { NextMiddleware } from "next/server";
import { NextResponse } from "next/server";
import { Config, clientSessionPath } from "@/lib/config";
import { internalExchangeTokenForSession } from "@lib/core";

export const withAuth = (
  config: Config,
  middlware?: NextMiddleware,
): NextMiddleware => {
  return async (request, event) => {
    const nextURL = request.nextUrl;
    if (nextURL.pathname.startsWith(config.loginCallbackPath())) {
      const code = nextURL.searchParams.get("code");
      const redirectURI = nextURL.searchParams.get("redirect_uri");
      if (!code || !redirectURI) {
        // handling error here
        return;
      }

      const session = await internalExchangeTokenForSession(config, code);
      if ("error" in session) {
        // redirect to unauthenticated route
        return;
      }

      const nextResp = NextResponse.next({ request });
      nextResp.cookies.set({
        name: "tailor.token",
        value: session.access_token,
        sameSite: "strict",
        httpOnly: true,
      });
      nextResp.cookies.set({
        name: "tailor.userid",
        value: session.user_id,
        sameSite: "strict",
        httpOnly: true,
      });

      return NextResponse.rewrite(config.appUrl(redirectURI), nextResp);
    } else if (nextURL.pathname.startsWith(clientSessionPath)) {
      const tailorToken = request.cookies.get("tailor.token");
      return NextResponse.json({ token: tailorToken?.value });
    }

    await middlware?.(request, event);
  };
};
