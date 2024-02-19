import { from, HttpLink, ServerError } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { Config } from "@client";
import { SessionResult } from "@lib/types";
import { internalClientSessionPath } from "@server/middleware/internal";

export const authenticatedHttpLink = (config: Config) =>
  from([
    new HttpLink({
      credentials: "include",
      uri: config.apiUrl("/query"),
    }),
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
      if (networkError) {
        if (networkError?.name === "ServerError") {
          const serverErrorStatusCode = (networkError as ServerError)
            .statusCode;
          if (serverErrorStatusCode === 401) {
            location.replace(config.unauthorizedPath());
          }
        }
      }
    }),
  ]);
