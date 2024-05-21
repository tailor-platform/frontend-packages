import { expect } from "vitest";
import { SAMLStrategy } from "@core/strategies/saml";
import { Config } from "@core";
import { samlParamsError } from "@core/strategies/abstract";

describe("saml strategy", () => {
  const strategy = new SAMLStrategy();
  const config = new Config({
    apiHost: "http://yourapp.mini.tailor.tech:8000",
    appHost: "http://localhost:3000",
  });
  it("saml authorize", () => {
    const payload = strategy.authenticate(config, { redirectPath: "/" });
    expect(payload.mode).toBe("redirection");
    expect(payload.uri).toBe(
      "http://yourapp.mini.tailor.tech:8000/auth/login?redirect_uri=http://localhost:3000/__auth/callback/saml?redirect_uri=/&state=/",
    );
  });
  it("saml callback parameter error", async () => {
    const req = new Request(
      "http://localhost:3000?code=code&redirect_uri=/path",
    );
    req.formData = async () => {
      const fd = new FormData();
      return Promise.resolve(fd);
    };
    await expect(strategy.callback(config, req)).rejects.toThrowError(
      samlParamsError(),
    );
  });
  it("saml callback", async () => {
    const req = new Request(
      "http://localhost:3000?code=code&redirect_uri=/path",
    );
    req.formData = async () => {
      const fd = new FormData();
      fd.set("SAMLResponse", "SAML-Data-Response");
      fd.set("RelayState", "/");
      return Promise.resolve(fd);
    };
    const res = await strategy.callback(config, req);
    expect(res.payload.get("SAMLResponse")).toBe("SAML-Data-Response");
    expect(res.payload.get("redirect_uri")).toBe(
      "http://localhost:3000/__auth/callback/saml",
    );
  });
});
