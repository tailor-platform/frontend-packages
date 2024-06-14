// Internal path to handle callback from the identity provider
export const internalCallbackPath = "/__auth/callback";
export const callbackByStrategy = (strategy: string = "default") =>
  `/__auth/callback/${strategy}` as const;

// Internal path to fetch token from client components
// `useSession` hook fetches token from this endpoint by extracting it from cookies.
export const internalClientSessionPath = "/__auth/session";

// Internal path redirecting (through middleware) to `unauthorizedPath` set in ContextConfig
// This is the path used in redirection caused by login guard in server components
// The middleware that reads ContextConfig is in charge of redirecting to the `unauthorizedPath`
// through this path when unauthorized users guarded in `getServerSession`.
export const internalUnauthorizedPath = "/__auth/unauthorized";

// Internal path to logout from client components
// This function deletes the token from cookies and redirects to the login page.
export const internalLogoutPath = "/__auth/logout";
