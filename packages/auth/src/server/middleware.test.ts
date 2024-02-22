import { describe, expect, it } from "vitest";
import { middlewareRouter } from "./middleware";
import { mockAuthConfig } from "@tests/mocks";
import { buildRequestWithParams } from "@tests/helper";

describe("middleware", () => {
  const testingError = new Error("this is testing error");

  describe("middlewareRouter", () => {
    it("calls onError when an error occured in middleware handlers", () => {
      const errorPath = "/error-route";
      const defaultParams = {
        request: buildRequestWithParams(mockAuthConfig.appUrl(errorPath)),
        config: mockAuthConfig,
      };
      const onErrorMock = vi.fn();

      expect(() =>
        middlewareRouter(
          {
            ...defaultParams,
            options: {
              onError: onErrorMock,
            },
          },
          {
            [errorPath]: () => {
              throw testingError;
            },
          },
        ),
      ).not.toThrowError();
      expect(onErrorMock).toHaveBeenCalledWith(testingError);
    });

    it("calls onError when an error occured in fallback middleware", () => {
      const defaultParams = {
        request: buildRequestWithParams(
          mockAuthConfig.appUrl("/path-that-nothing-matches"),
        ),
        config: mockAuthConfig,
      };
      const onErrorMock = vi.fn();
      const mockHandler = vi.fn();

      expect(() =>
        middlewareRouter(
          {
            ...defaultParams,
            options: {
              onError: onErrorMock,
            },
          },
          {
            "/mock-handler": mockHandler,
          },
          () => {
            throw testingError;
          },
        ),
      ).not.toThrowError();
      expect(onErrorMock).toHaveBeenCalledWith(testingError);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it("runs fallback middleware if no route matches", () => {
      const request = buildRequestWithParams(
        mockAuthConfig.appUrl("/test-path"),
      );
      const defaultParams = {
        request,
        config: mockAuthConfig,
      };
      const mockFallback = vi.fn();
      const mockHandler = vi.fn();

      expect(() =>
        middlewareRouter(
          {
            ...defaultParams,
          },
          {
            "/path-that-does-not-match": mockHandler,
          },
          mockFallback,
        ),
      ).not.toThrowError();
      expect(mockFallback).toHaveBeenCalled();
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });
});
