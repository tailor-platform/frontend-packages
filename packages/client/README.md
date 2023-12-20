# @tailor-platform/client

This package provides a React Context provider that handles user authentication.

## Usage

Use the `TailorProvider` component to wrap your application layouts/pages, for instance:

```
import { TailorProvider } from '@tailor-platform/client'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  if (!children) { return; }

  return (
    <TailorProvider>{children}</TailorProvider>
  );
};
```

Under the hood, the `TailorProvider` component uses [@apollo/client](https://www.npmjs.com/package/@apollo/client).

### Properties

#### `graphqlEndpoint`

The GraphQL endpoint can be set using the `graphqlEnpoint` property or through the `NEXT_PUBLIC_DOMAIN` environment variable.
If neither are set, it will fallback to `http://localhost:8000/query`.

#### `fallbackLoginPath`

The path, including query parameters, the user will be sent to if they initiate a GraphQL request while their session has expired.

There is no default value.
