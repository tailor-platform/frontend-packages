import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { columns } from "../utils/test";
import { LOCALIZATION_JA } from "../../../../locales/ja";
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
        localization: LOCALIZATION_JA,
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
          jointCondition: undefined,
          isChangeable: true,
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
        localization: LOCALIZATION_JA,
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
          jointCondition: undefined,
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
        localization: LOCALIZATION_JA,
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
          jointCondition: undefined,
          isChangeable: true,
        },
      },
      {
        index: 1,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: undefined,
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
        localization: LOCALIZATION_JA,
      }),
    );

    act(() => {
      result.current.resetFilterHandler();
    });

    const expectedValue: FilterRowData[] = [
      {
        index: 0,
        currentState: {
          column: "amount",
          value: 200,
          condition: "eq",
          jointCondition: undefined,
          isChangeable: true,
        },
      },
      {
        index: 1,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: undefined,
          isChangeable: true,
        },
      },
    ];
    expect(result.current.filterRows).toStrictEqual(expectedValue);
  });

  it("clearFilterHandler work as expected with defaultFilter", () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: undefined,
        defaultFilter: { status: { eq: "pending" } },
        localization: LOCALIZATION_JA,
      }),
    );

    act(() => {
      result.current.clearFilterHandler();
    });

    const expectedValue: FilterRowData[] = [
      {
        index: 0,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: undefined,
          isChangeable: true,
        },
      },
    ];
    expect(result.current.filterRows).toStrictEqual(expectedValue);
  });

  it("clearFilterHandler work as expected with defaultFilter and systemFilter", () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: { amount: { eq: 200 } },
        localization: LOCALIZATION_JA,
      }),
    );

    act(() => {
      result.current.clearFilterHandler();
    });

    const expectedValue: FilterRowData[] = [
      {
        index: 0,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: undefined,
          isChangeable: true,
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
        localization: LOCALIZATION_JA,
      }),
    );

    act(() => {
      result.current.deleteFilterRowHandler(1);
    });

    const expectedValue: FilterRowData[] = [
      {
        index: 0,
        currentState: {
          column: "amount",
          value: 200,
          condition: "eq",
          jointCondition: undefined,
          isChangeable: true,
        },
      },
      {
        index: 1,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: undefined,
          isChangeable: true,
        },
      },
    ];
    await waitFor(() => {
      expect(result.current.filterRows).toStrictEqual(expectedValue);
    });
  });

  it("generateGraphQLQueryFilter work as expected with no systemFilter and defaultFilter", async () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: undefined,
        defaultFilter: undefined,
        localization: LOCALIZATION_JA,
      }),
    );

    const filter: FilterRowState = {
      column: "amount",
      value: 200,
      condition: "eq",
      isChangeable: false,
    };

    act(() => {
      result.current.filterChangedHandler(0)(filter);
    });

    const expectedValue = {
      and: {
        amount: {
          eq: 200,
        },
      },
    };

    await waitFor(() => {
      expect(
        result.current.generateGraphQLQueryFilter(result.current.filterRows),
      ).toStrictEqual(expectedValue);
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
        localization: LOCALIZATION_JA,
      }),
    );

    act(() => {
      // It Represents a change made by the user
      result.current.filterChangedHandler(1)({
        column: "status",
        value: "success",
        condition: "eq",
        jointCondition: "and",
        isChangeable: false,
      });
      result.current.addNewFilterRowHandler();
      result.current.filterChangedHandler(2)({
        column: "email",
        value: "test@test.com",
        condition: "eq",
        jointCondition: "and",
        isChangeable: false,
      });
      result.current.addNewFilterRowHandler();
      result.current.filterChangedHandler(3)({
        column: "isCreditCard",
        value: true,
        condition: "eq",
        jointCondition: "and",
        isChangeable: false,
      });
    });

    const expectedValue = {
      and: {
        status: {
          eq: "pending",
        },
        and: [
          {
            amount: {
              eq: 200,
            },
          },
          {
            status: {
              eq: "success",
            },
          },
          {
            email: {
              eq: "test@test.com",
            },
          },
          {
            isCreditCard: {
              eq: true,
            },
          },
        ],
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
        localization: LOCALIZATION_JA,
      }),
    );

    act(() => {
      result.current.addNewFilterRowHandler();
      result.current.filterChangedHandler(1)({
        column: "status",
        value: "success",
        condition: "eq",
        jointCondition: "and",
        isChangeable: false,
      });
    });

    const expectedValue = {
      and: {
        and: [
          {
            amount: {
              eq: 200,
            },
          },
          {
            status: {
              eq: "success",
            },
          },
        ],
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
        localization: LOCALIZATION_JA,
      }),
    );

    // incompletely add filter
    act(() => {
      result.current.addNewFilterRowHandler();
    });

    // first render call.
    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledTimes(1);
    });
  });

  it("initialFilterRows works correctly when providing systemFilter", async () => {
    const systemFilter = { status: { eq: "pending" } };

    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: systemFilter,
        defaultFilter: undefined,
        localization: LOCALIZATION_JA,
      }),
    );

    const expectedValue: FilterRowData[] = [
      {
        index: 0,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: undefined,
          isChangeable: true,
        },
      },
    ];

    act(() => {
      expect(result.current.filterRows).toStrictEqual(expectedValue);
    });
  });

  it("initialFilterRows works correctly when providing defaultFilter", async () => {
    const defaultFilter = { status: { eq: "pending" } };

    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        defaultFilter: defaultFilter,
        localization: LOCALIZATION_JA,
      }),
    );

    const expectedValue: FilterRowData[] = [
      {
        index: 0,
        currentState: {
          column: "status",
          value: "pending",
          condition: "eq",
          jointCondition: undefined,
          isChangeable: true,
        },
      },
      {
        index: 1,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: undefined,
          isChangeable: true,
        },
      },
    ];

    act(() => {
      expect(result.current.filterRows).toStrictEqual(expectedValue);
    });
  });

  it("initialFilterRows works correctly when providing defaultFilter and systemFilter", async () => {
    const defaultFilter = { amount: { gt: 200 } };
    const systemFilter = { status: { eq: "pending" } };

    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        systemFilter: systemFilter,
        defaultFilter: defaultFilter,
        localization: LOCALIZATION_JA,
      }),
    );

    const expectedValue: FilterRowData[] = [
      {
        index: 0,
        currentState: {
          column: "amount",
          value: 200,
          condition: "gt",
          jointCondition: undefined,
          isChangeable: true,
        },
      },
      {
        index: 1,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: undefined,
          isChangeable: true,
        },
      },
    ];

    act(() => {
      expect(result.current.filterRows).toStrictEqual(expectedValue);
    });
  });

  it("If defaultFilter and systemFilter are not provided, hooks return undefined currentState", async () => {
    let currentFilter: GraphQLQueryFilter | undefined = undefined;

    renderHook(() =>
      useCustomFilter({
        columns,
        onChange: (filter) => {
          currentFilter = filter;
        },
        localization: LOCALIZATION_JA,
      }),
    );

    act(() => {
      expect(currentFilter).toStrictEqual(undefined);
    });
  });
});
