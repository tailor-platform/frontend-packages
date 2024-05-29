import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { columns } from "../utils/test";
import { FilterRowData, useCustomFilter } from "./useCustomFilter";
import { FilterRowState, GraphQLQueryFilter } from "./types";

describe("useCustomFilter", () => {
  it("resetFilterHandler work as expected with systemFilter", () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: undefined,
      }),
    );

    act(() => {
      result.current.resetFilterHandler();
    });

    const expectedValue: FilterRowData[] = [
      {
        index: 0,
        currentState: {
          column: "status",
          value: "pending",
          condition: "eq",
          jointCondition: "and",
          isSystem: true,
          isChangeable: false,
        },
      },
      {
        index: 1,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: "and",
          isSystem: false,
          isChangeable: false,
        },
      },
    ];
    expect(result.current.filterRows).toStrictEqual(expectedValue);
  });

  it("resetFilterHandler work as expected without systemFilter and defaultFilter", () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: undefined,
        defaultFilter: undefined,
      }),
    );

    act(() => {
      result.current.resetFilterHandler();
    });

    const expectedValue: FilterRowData[] = [
      {
        index: 0,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: "",
          isSystem: false,
          isChangeable: true,
        },
      },
    ];
    expect(result.current.filterRows).toStrictEqual(expectedValue);
  });

  it("resetFilterHandler work as expected with defaultFilter", () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: undefined,
        defaultFilter: { status: { eq: "pending" } },
      }),
    );

    act(() => {
      result.current.resetFilterHandler();
    });

    const expectedValue: FilterRowData[] = [
      {
        index: 0,
        currentState: {
          column: "status",
          value: "pending",
          condition: "eq",
          jointCondition: "and",
          isSystem: false,
          isChangeable: false,
        },
      },
      {
        index: 1,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: "",
          isSystem: false,
          isChangeable: true,
        },
      },
    ];
    expect(result.current.filterRows).toStrictEqual(expectedValue);
  });

  it("resetFilterHandler work as expected with defaultFilter and systemFilter", () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: { amount: { eq: 200 } },
      }),
    );

    act(() => {
      result.current.resetFilterHandler();
    });

    const expectedValue: FilterRowData[] = [
      {
        index: 0,
        currentState: {
          column: "status",
          value: "pending",
          condition: "eq",
          jointCondition: "and",
          isSystem: true,
          isChangeable: false,
        },
      },
      {
        index: 1,
        currentState: {
          column: "amount",
          value: 200,
          condition: "eq",
          jointCondition: undefined,
          isSystem: false,
          isChangeable: false,
        },
      },
      {
        index: 2,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: "and",
          isSystem: false,
          isChangeable: false,
        },
      },
    ];
    expect(result.current.filterRows).toStrictEqual(expectedValue);
  });

  it("deleteFilterRowHandler work as expected", async () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: { amount: { eq: 200 } },
      }),
    );

    act(() => {
      result.current.deleteFilterRowHandler(1);
    });

    const expectedValue: FilterRowData[] = [
      {
        index: 0,
        currentState: {
          column: "status",
          value: "pending",
          condition: "eq",
          jointCondition: "and",
          isSystem: true,
          isChangeable: false,
        },
      },
      {
        index: 1,
        currentState: {
          column: "amount",
          value: 200,
          condition: "eq",
          jointCondition: undefined,
          isSystem: false,
          isChangeable: false,
        },
      },
      {
        index: 2,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: "and",
          isSystem: false,
          isChangeable: false,
        },
      },
    ];
    await waitFor(() => {
      expect(result.current.filterRows).toStrictEqual(expectedValue);
    });
  });

  it("addToGraphQLQueryFilterRecursively work as expected", async () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: { amount: { eq: 200 } },
      }),
    );
    const graphQLQueryObject: GraphQLQueryFilter = {};
    const filter: FilterRowState = {
      column: "amount",
      value: 200,
      condition: "eq",
      isSystem: false,
      isChangeable: false,
    };

    act(() => {
      result.current.addToGraphQLQueryFilterRecursively(
        filter,
        graphQLQueryObject,
        "number",
      );
    });

    await waitFor(() => {
      expect(graphQLQueryObject).toStrictEqual({
        amount: { eq: 200 },
      });
    });
  });

  it("addToGraphQLQueryFilterRecursively work as expected with jointCondition", async () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: { amount: { eq: 200 } },
      }),
    );
    const graphQLQueryObject: GraphQLQueryFilter = {};
    const filter: FilterRowState = {
      column: "amount",
      value: 200,
      condition: "eq",
      isSystem: false,
      isChangeable: false,
      jointCondition: "or",
    };

    act(() => {
      result.current.addToGraphQLQueryFilterRecursively(
        filter,
        graphQLQueryObject,
        "number",
      );
    });

    await waitFor(() => {
      expect(graphQLQueryObject).toStrictEqual({
        or: {
          amount: { eq: 200 },
        },
      });
    });
  });

  it("addToGraphQLQueryFilterRecursively work as expected with initial graphQLQueryObject", async () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: { amount: { eq: 200 } },
      }),
    );
    const graphQLQueryObject: GraphQLQueryFilter = {
      or: {
        status: { eq: "pending" },
      },
    };
    const filter: FilterRowState = {
      column: "amount",
      value: 200,
      condition: "eq",
      isSystem: false,
      isChangeable: false,
      jointCondition: "or",
    };

    act(() => {
      result.current.addToGraphQLQueryFilterRecursively(
        filter,
        graphQLQueryObject,
        "number",
      );
    });

    await waitFor(() => {
      expect(graphQLQueryObject).toStrictEqual({
        or: {
          or: {
            amount: { eq: 200 },
          },
          status: { eq: "pending" },
        },
      });
    });
  });

  it("convertQueryToFilterRows work as expected with jointConditionValue", () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: { amount: { eq: 200 } },
      }),
    );

    const filter: GraphQLQueryFilter = {
      or: {
        status: { eq: "pending" },
      },
    };
    const expectedValue: FilterRowData[] = [
      {
        index: 1,
        currentState: {
          column: "status",
          value: "pending",
          condition: "eq",
          jointCondition: "or",
          isSystem: true,
          isChangeable: false,
        },
      },
    ];
    act(() => {
      expect(
        result.current.convertQueryToFilterRows(filter, true, 0),
      ).toStrictEqual(expectedValue);
    });
  });

  it("convertQueryToFilterRows work as expected without jointConditionValue", () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: { amount: { eq: 200 } },
      }),
    );

    const filter: GraphQLQueryFilter = {
      amount: { eq: 200 },
    };
    const expectedValue: FilterRowData[] = [
      {
        index: 0,
        currentState: {
          column: "amount",
          value: 200,
          condition: "eq",
          jointCondition: "and",
          isSystem: false,
          isChangeable: false,
        },
      },
    ];
    act(() => {
      expect(
        result.current.convertQueryToFilterRows(filter, false, 0),
      ).toStrictEqual(expectedValue);
    });
  });

  it("Multiple filter types woks correctly (type AND)", async () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: { amount: { eq: 200 } },
      }),
    );
    const graphQLQueryObject: GraphQLQueryFilter = {};
    const filter: FilterRowState = {
      column: "isCreditCard",
      value: true,
      condition: "eq",
      isSystem: false,
      isChangeable: false,
    };

    const filter2: FilterRowState = {
      column: "status",
      value: "success",
      condition: "eq",
      isSystem: false,
      isChangeable: false,
      jointCondition: "and",
    };

    const filter3: FilterRowState = {
      column: "createdAt",
      value: "2023-11-14",
      condition: "lte",
      isSystem: false,
      isChangeable: false,
      jointCondition: "and",
    };

    const filter4: FilterRowState = {
      column: "email",
      value: "test@test.com",
      condition: "eq",
      isSystem: false,
      isChangeable: false,
      jointCondition: "and",
    };

    const filter5: FilterRowState = {
      column: "amount",
      value: 800,
      condition: "gte",
      isSystem: false,
      isChangeable: false,
      jointCondition: "and",
    };

    act(() => {
      result.current.addToGraphQLQueryFilterRecursively(
        filter,
        graphQLQueryObject,
        "boolean",
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter,
        graphQLQueryObject,
        "boolean",
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter2,
        graphQLQueryObject,
        "string",
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter3,
        graphQLQueryObject,
        "string",
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter4,
        graphQLQueryObject,
        "string",
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter5,
        graphQLQueryObject,
        "number",
      );
    });

    await waitFor(() => {
      expect(graphQLQueryObject).toEqual({
        isCreditCard: { eq: true },
        and: {
          status: { eq: "success" },
          and: {
            createdAt: { lte: "2023-11-14" },
            and: {
              email: { eq: "test@test.com" },
              and: {
                amount: { gte: 800 },
              },
            },
          },
        },
      });
    });
  });

  it("Multiple filter types woks correctly (type OR)", async () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: { amount: { eq: 200 } },
      }),
    );
    const graphQLQueryObject: GraphQLQueryFilter = {};
    const filter: FilterRowState = {
      column: "isCreditCard",
      value: true,
      condition: "eq",
      isSystem: false,
      isChangeable: false,
    };

    const filter2: FilterRowState = {
      column: "status",
      value: "success",
      condition: "eq",
      isSystem: false,
      isChangeable: false,
      jointCondition: "or",
    };

    const filter3: FilterRowState = {
      column: "createdAt",
      value: "2023-11-14",
      condition: "lte",
      isSystem: false,
      isChangeable: false,
      jointCondition: "or",
    };

    const filter4: FilterRowState = {
      column: "email",
      value: "test@test.com",
      condition: "eq",
      isSystem: false,
      isChangeable: false,
      jointCondition: "or",
    };

    const filter5: FilterRowState = {
      column: "amount",
      value: 800,
      condition: "gte",
      isSystem: false,
      isChangeable: false,
      jointCondition: "or",
    };

    act(() => {
      result.current.addToGraphQLQueryFilterRecursively(
        filter,
        graphQLQueryObject,
        "boolean",
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter,
        graphQLQueryObject,
        "boolean",
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter2,
        graphQLQueryObject,
        "string",
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter3,
        graphQLQueryObject,
        "string",
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter4,
        graphQLQueryObject,
        "string",
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter5,
        graphQLQueryObject,
        "number",
      );
    });

    await waitFor(() => {
      expect(graphQLQueryObject).toEqual({
        isCreditCard: { eq: true },
        or: {
          status: { eq: "success" },
          or: {
            createdAt: { lte: "2023-11-14" },
            or: {
              email: { eq: "test@test.com" },
              or: {
                amount: { gte: 800 },
              },
            },
          },
        },
      });
    });
  });

  it("generateGraphQLQueryFilter woks correctly with systemFilter and defaultFilter", async () => {
    const systemFilter = { status: { eq: "pending" } };
    const defaultFilter = { amount: { eq: 200 } };

    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: systemFilter,
        defaultFilter: defaultFilter,
      }),
    );

    act(() => {
      // It Represents a change made by the user
      result.current.filterRows[1].currentState.jointCondition = "and";

      result.current.filterRows[2].currentState.value = "success";
      result.current.filterRows[2].currentState.condition = "eq";
      result.current.filterRows[2].currentState.column = "status";
    });

    const expectedValue = {
      and: {
        status: { eq: "pending" },
        and: {
          amount: { eq: 200 },
          and: {
            status: { eq: "success" },
          },
        },
      },
    };

    act(() => {
      expect(
        result.current.generateGraphQLQueryFilter(result.current.filterRows),
      ).toStrictEqual(expectedValue);
    });
  });

  it("generateGraphQLQueryFilter woks correctly with systemFilter", async () => {
    const systemFilter = { status: { eq: "pending" } };

    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: systemFilter,
        defaultFilter: undefined,
      }),
    );

    const expectedValue = {
      and: {
        status: { eq: "pending" },
      },
    };

    act(() => {
      expect(
        result.current.generateGraphQLQueryFilter(result.current.filterRows),
      ).toStrictEqual(expectedValue);
    });
  });

  it("generateGraphQLQueryFilter woks correctly with defaultFilter", async () => {
    const defaultFilter = { amount: { eq: 200 } };

    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: undefined,
        defaultFilter: defaultFilter,
      }),
    );

    const expectedValue = {
      and: {
        amount: { eq: 200 },
      },
    };

    act(() => {
      expect(
        result.current.generateGraphQLQueryFilter(result.current.filterRows),
      ).toStrictEqual(expectedValue);
    });
  });

  it("useEffect not called when prevFilter is same", async () => {
    const systemFilter = { status: { eq: "pending" } };
    const defaultFilter = { amount: { eq: 200 } };

    const onChangeMock = vi.fn();
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: onChangeMock,
        systemFilter: systemFilter,
        defaultFilter: defaultFilter,
      }),
    );

    // incompletely add filter
    act(() => {
      result.current.filterChangedHandler(2)({
        column: "",
        value: "",
        condition: "eq",
        jointCondition: "and",
        isSystem: false,
        isChangeable: false,
      });
    });

    // first render call.
    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledTimes(1);
    });
  });
});
