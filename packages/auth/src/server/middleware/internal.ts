import { NextResponse } from "next/server";
import { RouteHandler } from "@server/middleware";

// Internal path to handle callback from the identity provider
export const internalCallbackPath = "/__auth/callback" as const;
export const callbackByStrategy = (strategy: string = "default") =>
  `/__auth/callback/${strategy}` as const;

// Internal path to fetch token from client components
// `useSession` hook fetches token from this endpoint by extracting it from cookies.
export const internalClientSessionPath = "/__auth/session" as const;
export const internalClientSessionHandler: RouteHandler = ({ request }) => {
  const tailorToken = request.cookies.get("tailor.token");
  return NextResponse.json({ token: tailorToken?.value });
};

// Internal path redirecting (through middleware) to `unauthorizedPath` set in ContextConfig
// This is the path used in redirection caused by login guard in server components
// The middleware that reads ContextConfig is in charge of redirecting to the `unauthorizedPath`
// through this path when unauthorized users guarded in `getServerSession`.
export const internalUnauthorizedPath = "/__auth/unauthorized" as const;
export const internalUnauthroziedHandler: RouteHandler = ({ config }) =>
  NextResponse.redirect(config.appUrl(config.unauthorizedPath()));

// Internal path to logout from client components
// This function deletes the token from cookies and redirects to the login page.
export const internalLogoutPath = "/__auth/logout" as const;
export const internalLogoutHandler: RouteHandler = ({ request, config }) => {
  request.cookies.delete("tailor.token");
  return NextResponse.redirect(config.appUrl(config.loginPath()));
};
