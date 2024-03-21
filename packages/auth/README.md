# @tailor-platform/auth <!-- omit in toc -->

This package provides ways to handle Tailor authentication

- [Configuration](#configuration)
  - [Callback](#callback)
- [Provider](#provider)
- [Middlewares](#middlewares)
  - [`withAuth` middleware for Next.js](#withauth-middleware-for-nextjs)
- [Hooks (client)](#hooks-client)
  - [`useSession` hook](#usesession-hook)
  - [`useAuth` hook](#useauth-hook)
    - [Login](#login)
    - [Logout](#logout)
  - [`usePlatform` hook](#useplatform-hook)
- [Function (server)](#function-server)
  - [`getServerSession` hook](#getserversession-hook)
- [Adapters](#adapters)
  - [Apollo Client](#apollo-client)
- [Strategies](#strategies)
  - [Customization](#customization)

## Configuration

Create configuration in somewhere in your app:

```ts
import { Config } from "@tailor-platform/auth/core";

export const config = new Config({
  apiHost: "http://yourapp.mini.tailor.tech:8000",
  appHost: "http://localhost:3000",
});
```

Each of these properties in `config` to specific environment variables or constants you need to define in your application's environment.

Collectively, they form the configuration necessary for the client to handle user authentication in a standardized manner.

| Name             | Required | Description                                           | Default               |
| ---------------- | -------- | ----------------------------------------------------- | --------------------- |
| apiHost          | Yes      | Tailor Platform host                                  |                       |
| appHost          | Yes      | Frontend app host                                     |                       |
| unauthorizedPath |          | Path to be redirected if not authorized               | `/unauthorized`       |
| loginPath        |          | Auth service endpoint to initiate login               | `/auth/login`         |
| tokenPath        |          | Auth service endpoint to issue a session token        | `/auth/token`         |
| refreshTokenPath |          | Auth service refresh token endpoint                   | `/auth/token/refresh` |
| userInfoPath     |          | Auth service endpoint to fetch basic user information | `/auth/userinfo`      |

### Callback

This package automatically generates a callback handler with Next.js middleware to accept redirection from Identity Providers as `__auth/callback/{strategy}`.

Thus, if you are using OIDC strategy, the path you have to add in the whitelist on IDP dashboard will be `__auth/callback/oidc`.

## Provider

Use the `TailorAuthProvider` component to wrap your application layouts/pages, for instance:

```tsx
import { TailorAuthProvider } from "@tailor-platform/auth/client";
import { config } from "@/libs/authConfig";

export const Providers = ({ children }: { children: ReactNode }) => (
  <TailorAuthProvider config={config}>{children}</TailorAuthProvider>
);
```

## Middlewares

### `withAuth` middleware for Next.js

A middleware that mainly intercepts requests to login callback.

This middlware is required to be used in your app to use the hooks introduced later.

```tsx
import { withAuth } from "@tailor-platform/auth/server";
import { config as authConfig } from "@/libs/authConfig";

const middleware: unknown = withAuth(
  authConfig,
  {
    prepend: ({ token }) => {
      // Do something you want with token here
      // (eg. fetch user profile and store it in LocalStorage, ...)
    },
    onError: (e: Error) => {
      // Handle an error in authorization callback here
      // Use `NextResponse.redirect` to redirect your own error page or somewhere.
    },
  },
  (request, event) => {
    // Add middlewares here if you want to chain more of them
  },
);

export default middleware;
```

## Hooks (client)

### `useSession` hook

A hook to get token in client components.

```tsx
"use client";
import { useSession } from "@tailor-platform/auth/client";

const Page = () => {
  const session = useSession({
    // Enabling login guard will redirect you to the path specified in `authorizedPath` in config if not authorized
    required: true,
  });

  return <div>Token: {session.token}</div>;
};
```

### `useAuth` hook

A hook that provides authorization functionality for clients. It includes:

- `login`: A function to redirect to login URL.
- `refreshToken`: A function to refresh your token.

#### Login

`login` is a function retuned from `useAuth` hook that works as an entrypoint on client components to initialize authentication process.

```tsx
"use client";
import { useAuth } from "@tailor-platform/auth/client";

// Redirect to `/dashboard` after logging in
const Component = async () => {
  const { login } = useAuth();
  const doLogin = useCallback(() => {
    login({
      // name is optional, but you can specify one of the following:
      // * oidc (default)
      // * saml
      // * minitailor
      name: "oidc",

      // options are parameters required in strategies specified in `name` field above.
      // the fields here will vary on the strategy you use.
      options: {
        redirectPath: "/dashboard",
      },
    });
  }, [login]);

  return (
    <div>
      <button onClick={doLogin}>Login</button>
    </div>
  );
};
```

#### Logout

`logout` is a function to delete a session token to get logged out.

```tsx
"use client";
import { useAuth } from "@tailor-platform/auth/client";

// Redirect to login path after logged out
const Component = async () => {
  const { logout } = useAuth();

  return (
    <div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};
```

### `usePlatform` hook

The hook that provides utility functions for Tailor Platform specific operation. It includes:

- `getCurrentUser`: A function to retrieve the logged-in user's information using a valid session token.

Here is an example of how to use these functions:

```tsx
"use client";
import { usePlatform } from "@tailor-platform/auth/client";

const Component = async () => {
  const { token } = useSession();
  const { getCurrentUser } = usePlatform();

  const user = await getCurrentUser(token);

  // utilize session and user data...
};
```

## Function (server)

### `getServerSession` hook

A function to get token on server components that can be imported from `@tailor-platform/auth/server`.

```tsx
"use server";
import { getServerSession } from "@tailor-platform/auth/server";

const Page = () => {
  const session = getServerSession();

  return <div>Token: {session.token}</div>;
};
```

## Adapters

This package provides adapters to integrate authentication with third-party packages.

### Apollo Client

`@tailor-platform/auth/adapters/apollo` is a package with custom ApolloLink that automatically sets tokens in authorization header as a bearer token.

```ts
"use client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { authenticatedHttpLink } from "@tailor-platform/auth/adapters/apollo";
import { TailorAuthProvider } from "@tailor-platform/auth/client";
import dynamic from "next/dynamic";
import { config } from "@/libs/authConfig";

const ApolloProvider = dynamic(
  () => import("@apollo/client").then((modules) => modules.ApolloProvider),
  { ssr: false },
);

const client = new ApolloClient({
  link: authenticatedHttpLink(config),
  cache: new InMemoryCache(),
});

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <TailorAuthProvider config={config}>
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    </TailorAuthProvider>
  );
};
```

## Strategies

Strategies are plugin mechanism to add authentication process.

All built-in authentications are also implemented as a strategy. The default is `OIDCStrategy`.

### Customization

Users can implement their own custom authentication by writing custom strategies. See [src/strategies/abstract.ts](src/strategies/abstract.ts) to know interfaces expected to be implemented.

```ts
import { AbstractStrategy } from "@tailor-platform/auth/core";

type Option = {
  email: string;
  password: string;
};

export class YourOwnAuthenticationStrategy
  implements AbstractStrategy<Options>
{
  name() {
    return "your-own-strategy";
  }

  authenticate(config: Config, options: Options) {
    // Implement authentication here
    // Here will be executed on client components by `login` function in useAuth hook
    // (See `AuthenticateResult` type to know what this function is required to return)
  }

  callback(config: Config, params: URLSearchParams) {
    // Implement callback process here
    // Here will be executed in server side as a part of Next.js middleware
    // (See `CallbackResult` type to know what this function is required to return)
  }
}
```

Custom strategies can be pluged-in from your configuration.

```ts
export const config = new Config(
  {
    // your configurations here...
  },
  [new YourOwnAuthenticationStrategy()],
);
```
