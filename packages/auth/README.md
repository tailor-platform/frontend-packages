This package provides ways to handle Tailor authentication

- [Configuration](#configuration)
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

## Configuration

Create configuration in somewhere in your app:

```ts
import { Config } from "@tailor-platform/auth/core";

export const config = new Config({
  apiHost: "http://yourapp.mini.tailor.tech:8000",
  appHost: "http://localhost:3000",
});
```

## Hooks (client)

### `useSession` hook

A suspense hook to get token in client components.

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

- `getCurrentUser`: A suspense function to retrieve the logged-in user's information.

Here is an example of how to use these functions:

```tsx
"use client";
import { usePlatform } from "@tailor-platform/auth/client";

const Component = async () => {
  const { getCurrentUser } = usePlatform();

  const user = getCurrentUser();

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
