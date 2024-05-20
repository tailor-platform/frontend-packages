import {MinitailorStrategy} from "@core/strategies/minitailor";
import {Config} from "@core";

describe("minitailor strategy",  () => {
  const strategy = new MinitailorStrategy();
  it("minitailor authorize", async() => {
    const config = new Config({
      apiHost: "http://yourapp.mini.tailor.tech:8000",
      appHost: "http://localhost:3000",
    });
    const payload = await strategy.authenticate(config, {email: "example@example.com", redirectPath: "/"})
    expect(payload.mode).toBe("manual-callback");
    expect(payload.payload.id_token).not.toBeNull();
    expect(payload.payload.redirect_path).toBe('/');
  })
  it("minitailor callback",() => {
    const config = new Config({
      apiHost: "http://yourapp.mini.tailor.tech:8000",
      appHost: "http://localhost:3000",
    });
    const req = new Request("http://localhost:3000?id_token=token&redirect_path=/path");
    const res = strategy.callback(config, req);
    expect(res.payload.get("id_token")).toBe("token");
    expect(res.payload.get("redirect_uri")).toBe("http://localhost:3000/__auth/callback/minitailor");
  })
})