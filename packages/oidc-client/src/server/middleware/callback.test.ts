import { beforeAll, afterAll, afterEach, describe, expect, it } from "vitest";
import { NextResponse } from "next/server";
import { HttpResponse, http } from "msw";
import { callbackHandler, exchangeError, paramsError } from "./callback";
import {
  buildMockServer,
  mockAuthConfig,
  mockAuthConfigValue,
} from "@tests/mocks";
import { mockSession } from "@tests/mocks";
import { Config } from "@client";

const mockServer = buildMockServer();
beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

describe("callback", () => {
  it("obtains a token and stores it in the cookies", async () => {
    const params = new URLSearchParams({
      code: "12345",
      redirect_uri: "/users",
    });

    const onErrorMock = vi.fn();
    const prependMock = vi.fn();
    const result = await callbackHandler(params, mockAuthConfig, {
      prepend: prependMock,
    });

    expect(onErrorMock).not.toHaveBeenCalled();
    expect(prependMock).toHaveBeenCalledWith({
      token: mockSession.access_token,
      userID: mockSession.user_id,
    });
    expect(result).toBeInstanceOf(NextResponse);

    const token = result?.cookies.get("tailor.token");
    expect(token?.value).toBe(mockSession.access_token);
  });

  it("calls onError when params are invalid", async () => {
    const params = new URLSearchParams({
      code: "12345",
    });

    await expect(callbackHandler(params, mockAuthConfig)).rejects.toThrow(
      paramsError(),
    );
  });

  it("calls onError when the token exchange isn't successful", async () => {
    const invalidTokenPath = "/invalid-token-exchange";
    const invalidTokenError = "invalid token";

    mockServer.use(
      http.post(mockAuthConfig.apiUrl(invalidTokenPath), () => {
        return HttpResponse.json({
          error: invalidTokenError,
        });
      }),
    );

    const params = new URLSearchParams({
      code: "12345",
      redirect_uri: "/users",
    });

    const authConfig = new Config({
      ...mockAuthConfigValue,
      tokenPath: invalidTokenPath,
    });

    await expect(callbackHandler(params, authConfig)).rejects.toThrow(
      exchangeError(invalidTokenError),
    );
  });
});
