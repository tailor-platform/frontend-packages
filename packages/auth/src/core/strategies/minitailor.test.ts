import { afterEach } from "vitest";
import { MinitailorStrategy } from "@core/strategies/minitailor";
import { Config } from "@core";
import { minitailorTokenError } from "@core/strategies/abstract";

describe("minitailor strategy", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  const strategy = new MinitailorStrategy();
  it("minitailor authorize", async () => {
    vi.spyOn(global, "fetch").mockImplementation(async (args) => {
      const redirectPath = new URL(args as string).searchParams.get(
        "redirectPath",
      );
      return Promise.resolve(
        new Response(
          `{ "id_token": "test", "redirect_path": "${redirectPath}" }`,
          {
            status: 200,
          },
        ),
      );
    });
    const config = new Config({
      apiHost: "http://yourapp.mini.tailor.tech:8000",
      appHost: "http://localhost:3000",
    });
    const payload = await strategy.authenticate(config, {
      email: "example@example.com",
      redirectPath: "/",
    });
    expect(payload.mode).toBe("manual-callback");
    expect(payload.payload.id_token).toBe("test");
    expect(payload.payload.redirect_path).toBe("/");
  });
  it("minitailor authorize fail to fetch", async () => {
    vi.spyOn(global, "fetch").mockImplementation(async (args) => {
      const redirectPath = new URL(args as string).searchParams.get(
        "redirectPath",
      );
      return Promise.resolve(
        new Response(
          `{ "id_token": "test", "redirect_path": "${redirectPath}" }`,
          {
            status: 500,
          },
        ),
      );
    });
    const config = new Config({
      apiHost: "http://yourapp.mini.tailor.tech:8000",
      appHost: "http://localhost:3000",
    });
    await expect(() =>
      strategy.authenticate(config, {
        email: "example@example.com",
        redirectPath: "/",
      }),
    ).rejects.toThrowError(minitailorTokenError(500));
  });
  it("minitailor callback", () => {
    const config = new Config({
      apiHost: "http://yourapp.mini.tailor.tech:8000",
      appHost: "http://localhost:3000",
    });
    const req = new Request(
      "http://localhost:3000?id_token=token&redirect_path=/path",
    );
    const res = strategy.callback(config, req);
    expect(res.payload.get("id_token")).toBe("token");
    expect(res.payload.get("redirect_uri")).toBe(
      "http://localhost:3000/__auth/callback/minitailor",
    );
  });
});
