import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LOCALIZATION_JA } from "@locales";
import { columns } from "../utils/test";
import { useGraphQLQuery } from "./useGraphQLQuery";
import { QueryRow, FilterRowState } from "./types";

describe("useGraphQLQuery", () => {
  it("addToGraphQLQueryFilterRecursively work as expected with jointCondition", async () => {
    const { result } = renderHook(() =>
      useGraphQLQuery({
        columns,
        systemFilter: { status: { eq: "pending" } },
      }),
    );
    const graphQLQueryObject: QueryRow = {};
    const filter: FilterRowState = {
      column: "amount",
      value: 200,
      condition: "eq",
      isChangeable: false,
      jointCondition: "or",
    };

    act(() => {
      result.current.convertQueryFilter(filter, graphQLQueryObject, "number");
    });

    await waitFor(() => {
      expect(graphQLQueryObject).toStrictEqual({
        or: [
          {
            amount: {
              eq: 200,
            },
          },
        ],
      });
    });
  });

  it("convertQueryFilter work as expected with initial graphQLQueryObject", async () => {
    const { result } = renderHook(() =>
      useGraphQLQuery({
        columns,
        systemFilter: { status: { eq: "pending" } },
      }),
    );
    const graphQLQueryObject: QueryRow = {};
    const filter: FilterRowState = {
      column: "amount",
      value: 200,
      condition: "eq",
      isChangeable: false,
      jointCondition: "or",
    };

    act(() => {
      result.current.convertQueryFilter(filter, graphQLQueryObject, "number");
    });

    await waitFor(() => {
      expect(graphQLQueryObject).toStrictEqual({
        or: [
          {
            amount: {
              eq: 200,
            },
          },
        ],
      });
    });
  });

  it("generateGraphQLQueryFilter woks correctly with systemFilter", async () => {
    const systemFilter = { status: { eq: "pending" } };

    const { result } = renderHook(() =>
      useGraphQLQuery({
        columns,
        systemFilter: systemFilter,
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

  it("generateGraphQLQueryFilter works correctly with no filter", async () => {
    const { result } = renderHook(() =>
      useGraphQLQuery({
        columns,
        systemFilter: undefined,
      }),
    );

    const expectedValue = undefined;
    act(() => {
      expect(result.current.generateFilter([])).toStrictEqual(expectedValue);
    });
  });

  it("generateGraphQLQueryFilter works correctly with systemFilter which is empty object", async () => {
    const { result } = renderHook(() =>
      useGraphQLQuery({
        columns,
        systemFilter: {},
      }),
    );

    const expectedValue = undefined;
    act(() => {
      expect(result.current.generateFilter([])).toStrictEqual(expectedValue);
    });
  });
});
