import { NextResponse } from "next/server";
import { RouteHandler } from "@server/middleware";

/**
 * Internal handler for fetching the session token from the client.
 *
 * @see {@link internalClientSessionPath}
 */
export const internalClientSessionHandler: RouteHandler = ({ request }) => {
  const tailorToken = request.cookies.get("tailor.token");
  return NextResponse.json({ token: tailorToken?.value || null });
};

/**
 * Internal handler for unauthorized users.
 *
 * @see {@link internalUnauthorizedPath}
 */
export const internalUnauthroziedHandler: RouteHandler = ({ config }) =>
  NextResponse.redirect(config.appUrl(config.unauthorizedPath()));

/**
 * Internal handler for logging out.
 *
 * @see {@link internalLogoutPath}
 */
export const internalLogoutHandler: RouteHandler = ({ request, config }) => {
  const redirectPath =
    request.nextUrl.searchParams.get("redirect_path") || config.loginPath();
  const redirection = NextResponse.redirect(config.appUrl(redirectPath));
  redirection.cookies.delete("tailor.token");
  return redirection;
};
