import { NextMiddleware } from "next/server";
import { NextResponse } from "next/server";
import { Config } from "./config";
import { internalExchangeTokenForSession } from "./hooks";

export const withAuth = (
  config: Config,
  middlware: NextMiddleware,
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

      const nextResp = NextResponse.next({
        request,
      });

      nextResp.headers.set("x-tailor-token", session.access_token);
      nextResp.headers.set("x-tailor-user-id", session.user_id);
      return nextResp;
    }

    await middlware(request, event);
  };
};
