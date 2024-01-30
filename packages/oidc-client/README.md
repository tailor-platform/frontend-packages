# @tailor-platform/oidc-client

This package provides ways to handle Tailor OIDC authentication

## Usage

### Provider

Use the `TailorOidcProvider` component to wrap your application layouts/pages, for instance:

```ts
import { TailorOidcProvider } from '@tailor-platform/oidc-client'

const config = {
  apiUrl: API_URL,
  loginPath: OIDC_LOGIN_PATH,
  loginCallbackPath: OIDC_LOGIN_CALLBACK_PATH,
  tokenPath: OIDC_TOKEN_PATH,
  userInfoPath: OIDC_USERINFO_PATH,
};

export const Providers = ({ children }: { children: ReactNode }) => {
  if (!children) { return; }

  return (
    <TailorOidcProvider config={config}>{children}</TailorOidcProvider>
  );
};
```

### Config Parameters

Each of these properties in oidcConfig maps to specific environment variables or constants you need to define in your application's environment. Collectively, they form the configuration necessary for the OIDC client to handle user authentication in a standardized manner.

| Name              | Description                                                       |
| ------------------| ----------------------------------------------------------------- |
| apiUrl            | Tailor Platform URL                                               |
| loginPath         | Path the auth provider will redirect the user to after signing in |
| loginCallbackPath | Auth service login endpoint                                       |
| tokenPath         | Auth service token endpoint                                       |
| refreshTokenPath  | Auth service refresh token endpoint                               |
| userInfoPath      | Auth service endpoint to fetch basic user information             |

### Hooks

The useTailorOidcUtils hook provides utility functions for OIDC operations. It includes:

- `exchangeTokenForSession`: A function to exchange an authorization code for a session. This is typically used in the OIDC login callback flow.
- `getLoggedInPlatformUser`: A function to retrieve the logged-in user's information using a valid session token.

Here is an example of how to use these functions:

```ts
import { useTailorOidcUtils } from "@tailor-platform/oidc-client";

const Component = async () => {
  const { exchangeTokenForSession, getLoggedInPlatformUser } =
    useTailorOidcUtils();

  const session = await exchangeTokenForSession(code);
  const user = await getLoggedInPlatformUser(token);

  // utilize session and user data...
};
```
