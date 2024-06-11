import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { columns } from "../utils/test";
import { useGraphQLQuery } from "./useGraphQLQuery";
import { LOCALIZATION_JA } from "@locales";

describe("useGraphQLQuery", () => {
  describe("generateFilter", () => {
    it("works correctly with systemFilter", async () => {
      const systemFilter = { status: { eq: "pending" } };

      const { result } = renderHook(() =>
        useGraphQLQuery({
          columns,
          systemFilter: systemFilter,
          localization: LOCALIZATION_JA,
        }),
      );

      const expectedValue = {
        and: {
          status: { eq: "pending" },
        },
      };

      act(() => {
        expect(result.current.generateFilter([])).toStrictEqual(expectedValue);
      });
    });

    it("works correctly with no filter", async () => {
      const { result } = renderHook(() =>
        useGraphQLQuery({
          columns,
          systemFilter: undefined,
          localization: LOCALIZATION_JA,
        }),
      );

      const expectedValue = undefined;
      act(() => {
        expect(result.current.generateFilter([])).toStrictEqual(expectedValue);
      });
    });

    it("works correctly with systemFilter which is empty object", async () => {
      const { result } = renderHook(() =>
        useGraphQLQuery({
          columns,
          systemFilter: {},
          localization: LOCALIZATION_JA,
        }),
      );

      const expectedValue = undefined;
      act(() => {
        expect(result.current.generateFilter([])).toStrictEqual(expectedValue);
      });
    });
  });
});
