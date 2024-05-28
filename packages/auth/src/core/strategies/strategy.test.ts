import { expect } from "vitest";
import { defaultStrategy } from "./default";
import { SAMLStrategy } from "./saml";
import { OIDCStrategy } from "./oidc";
import { mockAuthConfig } from "@tests/mocks";
import { AbstractStrategy } from "@core";

describe("redirection", () => {
  const buildMockedRedirectionURL = (strategy: string) =>
    `https://mock-api-url.com/mock-login?redirect_uri=http://localhost:3000/__auth/callback/${strategy}`;

  const cases = {
    default: {
      builder: () => defaultStrategy,
      uri:
        buildMockedRedirectionURL("default") + "?redirect_uri=/redirect-path",
    },
    oidc: {
      builder: () => new OIDCStrategy(),
      uri: buildMockedRedirectionURL("oidc") + "?redirect_uri=/redirect-path",
    },
    saml: {
      builder: () => new SAMLStrategy(),
      uri: buildMockedRedirectionURL("saml") + "&state=/redirect-path",
    },
  } as const;

  it.each(Object.keys(cases))("initializes authentication (%s)", async (k) => {
    const key = k as keyof typeof cases;
    const strategy = cases[key].builder() as AbstractStrategy;
    const result = await strategy.authenticate(mockAuthConfig, {
      redirectPath: "/redirect-path",
    });

    expect(result.mode).toBe("redirection");
    if (result.mode === "redirection") {
      expect(result.uri).toBe(cases[key].uri);
    }
  });
});
