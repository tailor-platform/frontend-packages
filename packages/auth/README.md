This package provides ways to handle Tailor authentication

# Getting Started

The example steps below describes how to add authentication with Tailor Platform to your app.

## Install

```bash
npm install --save @tailor-platform/auth
```

## Configuration

Create your own instance of {@link core.Config | Config }.

```ts
import { Config } from "@tailor-platform/auth/core";

export const config = new Config({
  apiHost: "http://yourapp.mini.tailor.tech:8000",
  appHost: "http://localhost:3000",
});
```

## Add Next.js middleware

Use {@link server.withAuth | withAuth } to add Next.js middleware with your configuration.

```ts
import { withAuth } from "@tailor-platform/auth/server";
import { config as authConfig } from "@/libs/authConfig";

const middleware = withAuth(authConfig);

export default middleware;
```

## Mount React provider

Use {@link client.TailorAuthProvider} to authentication on client components.

```ts
import { TailorAuthProvider } from "@tailor-platform/auth/client";
import { config } from "@/libs/authConfig";

export const Providers = ({ children }: { children: ReactNode }) => (
 <TailorAuthProvider config={config}>{children}</TailorAuthProvider>
);
```

## Authenticate

Use {@link client.useAuth | useAuth } hook to initiate the authentication.

```tsx
"use client";
import { useAuth } from "@tailor-platform/auth/client";

const Component = async () => {
  const { login } = useAuth();
  const doLogin = useCallback(() => {
    login({
      name: "saml", // strategy name
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

## More

This package has still more functionalities.

### Server

A set of functionss for server components ({@link server.getServerSession | getServerSession}) are also available.

### Integration with apollo-client

A custom ApolloLink is available. See {@link adapters/apollo.authenticatedHttpLink | authenticatedHttpLink} for more information.

### Customization

Pluggable authentication adapters are supported. See {@link core.AbstractStrategy | AbstractStrategy} for more information.
