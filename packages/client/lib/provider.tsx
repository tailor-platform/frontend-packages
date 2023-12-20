import { ReactNode, useEffect, useReducer, useState } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ServerError,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { InMemoryCacheConfig } from "@apollo/client/cache/inmemory/types";
import { Context, getAuthToken, userInfoDefault, userReducer } from "./user";

type TailorProviderProps = {
  children: ReactNode;
  graphqlEndpoint?: string;
  inMemoryCacheConfig?: InMemoryCacheConfig;
  fallbackLoginPath?: string;
};

const extractGraphqlEndpoint = (graphqlEndpoint: string | undefined): string =>
  graphqlEndpoint ??
  process.env.NEXT_PUBLIC_DOMAIN ??
  "http://localhost:8000/query";

export const TailorProvider = ({
  children,
  graphqlEndpoint,
  inMemoryCacheConfig,
  fallbackLoginPath,
}: TailorProviderProps) => {
  const [, setLoading] = useState(true);
  const [user, dispatchUser] = useReducer(userReducer, userInfoDefault);

  useEffect(() => {
    setLoading(false);
  }, []);
  const authLink = setContext((_, { headers }) => {
    const authorizationHeader = (): { authorization?: string } => {
      if (headers && "authorization" in headers) {
        // setContext method provides us the context typed as `Record<string, any>` so no way to supress eslint error without disabling it
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        return { authorization: headers.authorization };
      }

      const token = getAuthToken();
      if (token) {
        return { authorization: `Bearer ${token}` };
      }

      return {};
    };

    return {
      // Disabling eslint here by the same reason of L14
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      headers: {
        ...headers,
        ...authorizationHeader(),
      },
    };
  });
  const httpLink = new HttpLink({
    credentials: "include",
    uri: extractGraphqlEndpoint(graphqlEndpoint),
  });
  const errorLink = onError(({ networkError }) => {
    if (networkError) {
      if (networkError?.name === "ServerError") {
        const serverErrorStatusCode = (networkError as ServerError).statusCode;
        if (serverErrorStatusCode === 401) {
          dispatchUser({ type: "delete" });
          if (fallbackLoginPath) {
            location.replace(fallbackLoginPath);
          }
        }
      }
    }
  });
  const client = new ApolloClient({
    cache: new InMemoryCache(inMemoryCacheConfig),
    link: from([authLink, httpLink]),
    queryDeduplication: false,
    connectToDevTools: true,
  });
  client.setLink(from([authLink, errorLink, httpLink]));

  return (
    <Context.Provider
      value={{
        user,
        dispatchUser,
      }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </Context.Provider>
  );
};
