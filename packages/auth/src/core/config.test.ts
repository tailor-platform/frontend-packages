import { describe, expect, it } from "vitest";
import { NoCorrespondingStrategyError } from "@core/config";
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

    it("returns default strategy if no name specified", () => {
      const strategy = mockAuthConfig.getStrategy();
      expect(strategy.name()).toBe("default");
    });

    it("raises an error if the unavailable strategy is specified", () => {
      expect(() => mockAuthConfig.getStrategy("invalid-strategy")).toThrowError(
        NoCorrespondingStrategyError,
      );
    });
  });
});
