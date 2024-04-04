import { from, HttpLink, ServerError } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { Config } from "@core/config";
import { SessionResult } from "@core/types";
import { internalClientSessionPath } from "@server/middleware/internal";

/**
 * authenticatedHttpLink is a custom ApolloLink that automatically sets tokens in authorization header as a bearer token.
 *
 * @example
 * ```
 * "use client";
 * import { ApolloClient, InMemoryCache } from "@apollo/client";
 * import { authenticatedHttpLink } from "@tailor-platform/auth/adapters/apollo";
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

        const rawResp = await fetch(config.appUrl(internalClientSessionPath));
        const session = (await rawResp.json()) as SessionResult;
        if (session.token) {
          return { authorization: `Bearer ${session.token}` };
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
          location.replace(config.unauthorizedPath());
        }
      }
    }),

    // HttpLink should always be put at last in order to avoid `You are calling concat on a terminating link` error
    new HttpLink({
      credentials: "include",
      uri: config.apiUrl("/query"),
    }),
  ]);
