import { describe, expect, it } from "vitest";
import { middlewareRouter } from "./middleware";
import { mockAuthConfig } from "@tests/mocks";
import {
  buildRequestWithParams,
  testingError,
  testingErrorHandler,
} from "@tests/helper";

describe("middleware", () => {
  describe("middlewareRouter", () => {
    it("calls onError when an error occured in extra middleware", () => {
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
            [errorPath]: testingErrorHandler,
          },
        ),
      ).not.toThrowError();
      expect(onErrorMock).toHaveBeenCalledWith(testingError);
    });
  });
});
