import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { columns } from "../utils/test";
import { useGraphQLQuery } from "./useGraphQLQuery";
import { QueryRow, FilterRowState } from "./types";
import { LOCALIZATION_JA } from "@locales";

describe("useGraphQLQuery", () => {
  it("convertQueryFilter work as expected with no jointCondition", async () => {
    const { result } = renderHook(() =>
      useGraphQLQuery({
        columns,
        systemFilter: { status: { eq: "pending" } },
        localization: LOCALIZATION_JA,
      }),
    );
    const graphQLQueryObject: QueryRow = {};
    const filter: FilterRowState = {
      column: "amount",
      value: 200,
      condition: "eq",
      isChangeable: true,
      jointCondition: undefined,
    };

    act(() => {
      result.current.convertQueryFilter(filter, graphQLQueryObject, "number");
    });

    await waitFor(() => {
      expect(graphQLQueryObject).toStrictEqual({
        amount: {
          eq: 200,
        },
      });
    });
  });

  it("convertQueryFilter work as expected with jointCondition", async () => {
    const { result } = renderHook(() =>
      useGraphQLQuery({
        columns,
        systemFilter: { status: { eq: "pending" } },
        localization: LOCALIZATION_JA,
      }),
    );
    const graphQLQueryObject: QueryRow = {};
    const filter: FilterRowState = {
      column: "amount",
      value: 200,
      condition: "eq",
      isChangeable: true,
      jointCondition: "and",
    };

    act(() => {
      result.current.convertQueryFilter(filter, graphQLQueryObject, "number");
    });

    await waitFor(() => {
      expect(graphQLQueryObject).toStrictEqual({
        and: [
          {
            amount: {
              eq: 200,
            },
          },
        ],
      });
    });
  });

  it("convertQueryFilter append filter to array", async () => {
    const { result } = renderHook(() =>
      useGraphQLQuery({
        columns,
        systemFilter: { status: { eq: "pending" } },
        localization: LOCALIZATION_JA,
      }),
    );
    const graphQLQueryObject: QueryRow = {
      and: [
        {
          status: {
            eq: "pending",
          },
        },
      ],
    };
    const filter: FilterRowState = {
      column: "amount",
      value: 200,
      condition: "eq",
      isChangeable: true,
      jointCondition: "and",
    };

    act(() => {
      result.current.convertQueryFilter(filter, graphQLQueryObject, "number");
    });

    await waitFor(() => {
      expect(graphQLQueryObject).toStrictEqual({
        and: [
          {
            status: {
              eq: "pending",
            },
          },
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

  it("generateGraphQLQueryFilter works correctly with no filter", async () => {
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

  it("generateGraphQLQueryFilter works correctly with systemFilter which is empty object", async () => {
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
