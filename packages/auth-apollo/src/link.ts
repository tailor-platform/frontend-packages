import { from, HttpLink, makeVar, ServerError } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { Config, SessionResult } from "@tailor-platform/auth/core";

// Internal path to fetch token from client components
// `useSession` hook fetches token from this endpoint by extracting it from cookies.
const internalClientSessionPath = "/__auth/session";

// Internal path to logout from client components
// This function deletes the token from cookies and redirects to the login page.
const internalLogoutPath = "/__auth/logout";

/**
 * Internal commonized procedure to logout the current user.
 */
const logoutInternal = (config: Config, redirectPath?: string) => {
  const searchParams = new URLSearchParams({
    redirect_path: redirectPath || config.loginPath(),
  });
  window.location.replace(
    `${config.appUrl(internalLogoutPath)}?${searchParams.toString()}`,
  );
};

/**
 * authenticatedHttpLink is a custom ApolloLink that automatically sets tokens in authorization header as a bearer token.
 *
 * @example
 * ```
 * "use client";
 * import { ApolloClient, InMemoryCache } from "@apollo/client";
 * import { authenticatedHttpLink } from "@tailor-platform/auth-apollo";
 * import { TailorAuthProvider } from "@tailor-platform/auth/client";
 * import dynamic from "next/dynamic";
 * import { config } from "@/libs/authConfig";
 *
 * const ApolloProvider = dynamic(
 *   () => import("@apollo/client").then((modules) => modules.ApolloProvider),
 *   { ssr: false },
 * );
 *
 * const client = new ApolloClient({
 *   link: authenticatedHttpLink(config),
 *   cache: new InMemoryCache(),
 * });
 *
 * export const Providers = ({ children }: { children: ReactNode }) => {
 *   return (
 *     <TailorAuthProvider config={config}>
 *       <ApolloProvider client={client}>
 *         {children}
 *       </ApolloProvider>
 *     </TailorAuthProvider>
 *   );
 * };
 * ```
 */
export const authenticatedHttpLink = (config: Config) =>
  from([
    setContext(async (_, { headers }) => {
      const buildAuthorizationHeader = async () => {
        if (headers && "authorization" in headers) {
          // setContext method provides us the context typed as `Record<string, any>` so no way to supress eslint error without disabling it
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          return { authorization: headers.authorization };
        }

        const sessionToken = await fetchSessionToken(config);
        if (sessionToken) {
          return { authorization: `Bearer ${sessionToken}` };
        }

        return {};
      };

      const authorizationHeaders = await buildAuthorizationHeader();
      return {
        // Disabling eslint here by the same reason of L14
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        headers: {
          ...headers,
          ...authorizationHeaders,
        },
      };
    }),
    onError(({ networkError }) => {
      if (networkError?.name === "ServerError") {
        const serverErrorStatusCode = (networkError as ServerError).statusCode;
        if (serverErrorStatusCode === 401) {
          logoutInternal(config, config.unauthorizedPath());
        }
      }
    }),

    // HttpLink should always be put at last in order to avoid `You are calling concat on a terminating link` error
    new HttpLink({
      credentials: "include",
      uri: config.apiUrl("/query"),
    }),
  ]);

/**
 * fetchSessionToken fetches the session token from the server.
 * If the token is already stored in the cache, it returns the token on memory to avoid unnecessary fetch.
 */
const fetchSessionToken = async (config: Config) => {
  const currentSeessionToken = sessionToken();
  if (currentSeessionToken.token) {
    return currentSeessionToken.token;
  }

  const rawResp = await fetch(config.appUrl(internalClientSessionPath));
  const session = (await rawResp.json()) as SessionResult;
  const { token } = sessionToken(session);
  return token;
};
const sessionToken = makeVar<SessionResult>({
  token: null,
});
