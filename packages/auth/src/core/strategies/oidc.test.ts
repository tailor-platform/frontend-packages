import { expect } from "vitest";
import { OIDCStrategy } from "@core/strategies/oidc";
import { Config } from "@core";

describe("oidv strategy", () => {
  const strategy = new OIDCStrategy();
  const config = new Config({
    apiHost: "http://yourapp.mini.tailor.tech:8000",
    appHost: "http://localhost:3000",
  });
  it("oidc authorize", () => {
    const payload = strategy.authenticate(config, { redirectPath: "/" });
    expect(payload.mode).toBe("redirection");
    expect(payload.uri).toBe(
      "http://yourapp.mini.tailor.tech:8000/auth/login?redirect_uri=http://localhost:3000/__auth/callback/oidc?redirect_uri=/",
    );
  });
  it("oidc callback", () => {
    const req = new Request(
      "http://localhost:3000?code=code&redirect_uri=/path",
    );
    const res = strategy.callback(config, req);
    expect(res.payload.get("code")).toBe("code");
    expect(res.payload.get("redirect_uri")).toBe(
      "http://localhost:3000/__auth/callback/oidc",
    );
  });
  it("oidc callback error", () => {
    expect(() =>
      strategy.callback(config, new Request("http://localhost:3000")),
    ).toThrow("code and redirectURI should be filled");
    expect(() =>
      strategy.callback(config, new Request("http://localhost:3000?code=test")),
    ).toThrow("code and redirectURI should be filled");
    expect(() =>
      strategy.callback(
        config,
        new Request("http://localhost:3000?redirect_uri=/path"),
      ),
    ).toThrow("code and redirectURI should be filled");
  });
});
