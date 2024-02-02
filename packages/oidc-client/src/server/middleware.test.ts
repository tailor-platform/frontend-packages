import {
  beforeEach,
  afterEach,
  test,
  describe,
  expect,
  it,
  MockInstance,
} from "vitest";
import { NextResponse } from "next/server";
import { exchangeError, handleCallback, paramsError } from "./middleware";
import { mockAuthConfig } from "@tests/mocks";
import { mockSession } from "@tests/mocks";

describe("middleware", () => {
  let fetchSpy: MockInstance;

  beforeEach(() => {
    fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(JSON.stringify(mockSession)));
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  describe("handleCallback", () => {
    it("should succeed", async () => {
      const params = new URLSearchParams({
        code: "12345",
        redirect_uri: "/users",
      });

      const onErrorMock = vi.fn();
      const prependMock = vi.fn();
      const result = await handleCallback(params, mockAuthConfig, {
        onError: onErrorMock,
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

    it("should call onError when params are impaired", async () => {
      // Impaired params
      const params = new URLSearchParams({
        code: "12345",
      });

      const onErrorMock = vi.fn();
      await handleCallback(params, mockAuthConfig, {
        onError: onErrorMock,
      });

      expect(onErrorMock).toHaveBeenCalledWith(paramsError());
    });

    it("should call onError when errored in exchanging token with session", async () => {
      const params = new URLSearchParams({
        code: "12345",
        redirect_uri: "/users",
      });

      const errorResp = {
        error: "internal testing error",
      };
      fetchSpy.mockResolvedValue(new Response(JSON.stringify(errorResp)));

      const onErrorMock = vi.fn();
      await handleCallback(params, mockAuthConfig, {
        onError: onErrorMock,
      });

      expect(onErrorMock).toHaveBeenCalledWith(exchangeError(errorResp.error));
    });
  });
});
