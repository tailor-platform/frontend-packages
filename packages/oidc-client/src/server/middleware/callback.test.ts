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
import { buildRequestWithParams } from "@tests/helper";

const mockServer = buildMockServer();
beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

describe("callback", () => {
  const baseURL = mockAuthConfig.appUrl(mockAuthConfig.loginCallbackPath());

  it("obtains a token and stores it in the cookies", async () => {
    const request = buildRequestWithParams(
      baseURL,
      new URLSearchParams({
        code: "12345",
        redirect_uri: "/users",
      }),
    );

    const onErrorMock = vi.fn();
    const prependMock = vi.fn();
    const result = await callbackHandler({
      request,
      config: mockAuthConfig,
      options: {
        prepend: prependMock,
      },
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
    const request = buildRequestWithParams(
      baseURL,
      new URLSearchParams({
        code: "12345",
      }),
    );

    await expect(
      callbackHandler({ request, config: mockAuthConfig }),
    ).rejects.toThrow(paramsError());
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

    const request = buildRequestWithParams(
      baseURL,
      new URLSearchParams({
        code: "12345",
        redirect_uri: "/users",
      }),
    );

    const authConfig = new Config({
      ...mockAuthConfigValue,
      tokenPath: invalidTokenPath,
    });

    await expect(
      callbackHandler({ request, config: authConfig }),
    ).rejects.toThrow(exchangeError(invalidTokenError));
  });
});
