type ContextConfig = {
  apiHost: string;
  appHost: string;
  loginPath: string;
  unauthorizedPath: string;
  loginCallbackPath: string;
  tokenPath: string;
  refreshTokenPath: string;
  userInfoPath: string;
};

export class Config {
  // Only "apiUrl" should be required
  constructor(
    private readonly params: Pick<ContextConfig, "apiHost" | "appHost"> &
      Partial<ContextConfig>,
  ) {}

  apiUrl(path: string) {
    return this.params.apiHost + path;
  }

  appUrl(path: string) {
    return this.params.appHost + path;
  }

  loginPath() {
    return this.params.loginPath || "/auth/login";
  }

  unauthorizedPath() {
    return this.params.unauthorizedPath || "/unauthorized";
  }

  loginCallbackPath() {
    return this.params.loginCallbackPath || "/login/callback";
  }

  tokenPath() {
    return this.params.tokenPath || "/auth/token";
  }

  refreshTokenPath() {
    return this.params.refreshTokenPath || "/auth/token/refresh";
  }

  userInfoPath() {
    return this.params.userInfoPath || "/auth/userinfo";
  }
}

// Internal path to fetch token from client components
// `useSession` hook fetches token from this endpoint by extracting it from cookies.
export const clientSessionPath = "/__auth/session" as const;

// Internal path redirecting (through middleware) to `unauthorizedPath` set in ContextConfig
// This is the path used in redirection caused by login guard in server components
// The middleware that reads ContextConfig is in charge of redirecting to the `unauthorizedPath`
// through this path when unauthorized users guarded in `getServerSession`.
export const internalUnauthorizedPath = "/__auth/unauthorized" as const;
