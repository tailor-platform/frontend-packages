import { defaultStrategy } from "./default";
import { OIDCStrategy, SAMLStrategy } from "./sso";
import { mockAuthConfig } from "@tests/mocks";

describe("redirection", () => {
  const buildMockedRedirectionURL = (strategy: string) =>
    `https://mock-api-url.com/mock-login?redirect_uri=http://localhost:3000/mock-callback/${strategy}?redirect_uri=/redirect-path`;

  const cases = {
    default: {
      builder: () => defaultStrategy,
      uri: buildMockedRedirectionURL("default"),
    },
    oidc: {
      builder: () => new OIDCStrategy(),
      uri: buildMockedRedirectionURL("oidc"),
    },
    saml: {
      builder: () => new SAMLStrategy(),
      uri: buildMockedRedirectionURL("saml"),
    },
  } as const;

  it.each(Object.keys(cases))("initializes authentication (%s)", (k) => {
    const key = k as keyof typeof cases;
    const strategy = cases[key].builder();
    const result = strategy.authenticate(mockAuthConfig, {
      redirectPath: "/redirect-path",
    });

    expect(result.uri).toBe(cases[key].uri);
  });
});
