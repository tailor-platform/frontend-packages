# @tailor-platform/oidc-client

This package provides ways to handle Tailor authentication

## Usage

### Provider

Use the `TailorAuthProvider` component to wrap your application layouts/pages, for instance:

```ts
import { TailorAuthProvider } from '@tailor-platform/oidc-client'

const config = {
  apiUrl: API_URL,
};

export const Providers = ({ children }: { children: ReactNode }) => {
  if (!children) { return; }

  return (
    <TailorAuthProvider config={config}>{children}</TailorAuthProvider>
  );
};
```

### Config Parameters

Each of these properties in `config` to specific environment variables or constants you need to define in your application's environment. Collectively, they form the configuration necessary for the client to handle user authentication in a standardized manner.

| Name              | Required | Description                                                       | Default               |
| ----------------- | -------- | ----------------------------------------------------------------- | --------------------- |
| apiUrl            | Yes      | Tailor Platform URL                                               |                       |
| loginPath         |          | Path the auth provider will redirect the user to after signing in | `/auth/login`         |
| loginCallbackPath |          | Auth service login endpoint                                       | `/login/callback`     |
| tokenPath         |          | Auth service token endpoint                                       | `/auth/token`         |
| refreshTokenPath  |          | Auth service refresh token endpoint                               | `/auth/token/refresh` |
| userInfoPath      |          | Auth service endpoint to fetch basic user information             | `/auth/userinfo`      |

### Hooks

The useTailorAuthUtils hook provides utility functions for operations. It includes:

- `exchangeTokenForSession`: A function to exchange an authorization code for a session. This is typically used in the login callback flow.
- `getLoggedInPlatformUser`: A function to retrieve the logged-in user's information using a valid session token.

Here is an example of how to use these functions:

```ts
import { useTailorAuthUtils } from "@tailor-platform/oidc-client";

const Component = async () => {
  const { exchangeTokenForSession, getLoggedInPlatformUser } =
    useTailorAuthUtils();

  const session = await exchangeTokenForSession(code);
  const user = await getLoggedInPlatformUser(token);

  // utilize session and user data...
};
```
