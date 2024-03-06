import { describe, expect, it } from "vitest";
import { mockAuthConfig } from "@tests/mocks";

describe("Config", () => {
  describe("getStrategy", () => {
    it.each(["saml", "oidc", "minitailor"])(
      "returns a corresponding strategy by name (%s)",
      (name) => {
        const strategy = mockAuthConfig.getStrategy(name);

        expect(strategy?.name()).toBe(name);
      },
    );
  });
});
