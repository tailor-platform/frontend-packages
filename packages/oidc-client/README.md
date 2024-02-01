# @tailor-platform/oidc-client

This package provides ways to handle Tailor authentication

## Usage

### Configuration

Create configuration in somewhere in your app:

```ts
import { Config } from "@tailor-platform/oidc-client";

export const config = new Config({
  apiHost: "http://ima.mini.tailor.tech:8000",
  appHost: "http://localhost:3000",
});
```

Each of these properties in `config` to specific environment variables or constants you need to define in your application's environment. Collectively, they form the configuration necessary for the client to handle user authentication in a standardized manner.

| Name              | Required | Description                                                       | Default               |
| ----------------- | -------- | ----------------------------------------------------------------- | --------------------- |
| apiHost           | Yes      | Tailor Platform host                                              |                       |
| appHost           | Yes      | Frontend app host                                                 |                       |
| loginPath         |          | Path the auth provider will redirect the user to after signing in | `/auth/login`         |
| unauthorizedPath  |          | Path to be redirected if not authorized                           | `/unauthorized`       |
| loginCallbackPath |          | Auth service login endpoint                                       | `/login/callback`     |
| tokenPath         |          | Auth service token endpoint                                       | `/auth/token`         |
| refreshTokenPath  |          | Auth service refresh token endpoint                               | `/auth/token/refresh` |
| userInfoPath      |          | Auth service endpoint to fetch basic user information             | `/auth/userinfo`      |

### Provider

Use the `TailorAuthProvider` component to wrap your application layouts/pages, for instance:

```tsx
import { TailorAuthProvider } from "@tailor-platform/oidc-client";
import { config } from "@/libs/authConfig";

export const Providers = ({ children }: { children: ReactNode }) => (
  <TailorAuthProvider config={config}>{children}</TailorAuthProvider>
);
```

### Middlewares

#### `withAuth` middleware for Next.js

A middleware that mainly intercepts requests to login callback.

This middlware is required to be used in your app to use the hooks introduced later.

```tsx
import { withAuth } from "@tailor-platform/oidc-client/server";
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

### Hooks (client)

#### `useSession` hook

A hook to get token in client components.

```tsx
"use client";
import { useSession } from "@tailor-platform/oidc-client";

const Page = () => {
  const session = useSession({
    // Enabling login guard will redirect you to the path specified in `authorizedPath` in config if not authorized
    required: true,
  });

  return <div>Token: {session.token}</div>;
};
```

#### `useTailorAuthUtils` hook

The hook that provides utility functions for operations. It includes:

- `getLoggedInPlatformUser`: A function to retrieve the logged-in user's information using a valid session token.
- `makeLoginUrl`: A function to create login URL

Here is an example of how to use these functions:

```tsx
"use client";
import { useTailorAuthUtils } from "@tailor-platform/oidc-client";

const Component = async () => {
  const { token } = useSession();
  const { getLoggedInPlatformUser } = useTailorAuthUtils();

  const user = await getLoggedInPlatformUser(token);

  // utilize session and user data...
};
```

### Function (server)

#### `getServerSession` hook

A function to get token on server components that can be imported from `@tailor-platform/oidc-client/server`.

```tsx
"use server";
import { getServerSession } from "@tailor-platform/oidc-client/server";

const Page = () => {
  const session = getServerSession();

  return <div>Token: {session.token}</div>;
};
```
