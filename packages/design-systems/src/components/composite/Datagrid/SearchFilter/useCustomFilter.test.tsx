import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LOCALIZATION_JA } from "../../../../locales/ja";
import { LOCALIZATION_EN } from "../../../../locales/en";
import { Payment, columns } from "../utils/test";
import { FilterRowData, useCustomFilter } from "./useCustomFilter";
import { jointConditions } from "./filter";
import { FilterRowState, GraphQLQueryFilter } from "./types";

describe("useCustomFilter", () => {
  it("resetFilterHandler work as expected with systemFilter", () => {
    const { result } = renderHook(() =>
      useCustomFilter({
        columns,
        onChange: () => {
          return;
        },
        localization: LOCALIZATION_JA,
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: undefined,
      }),
    );

    act(() => {
      result.current.resetFilterHandler();
    });

    const expectedValue: FilterRowData<Payment>[] = [
      {
        index: 0,
        isFirstRow: true,
        jointConditions: jointConditions,
        columns: columns,
        currentState: {
          column: "status",
          value: "pending",
          condition: "eq",
          jointCondition: undefined,
          isSystem: true,
          isChangeable: false,
        },
        localization: LOCALIZATION_JA,
      },
      {
        index: 1,
        isFirstRow: true,
        jointConditions: jointConditions,
        columns: columns,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: "and",
          isSystem: false,
          isChangeable: false,
        },
        localization: LOCALIZATION_JA,
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
        localization: LOCALIZATION_JA,
        systemFilter: undefined,
        defaultFilter: undefined,
      }),
    );

    act(() => {
      result.current.resetFilterHandler();
    });

    const expectedValue: FilterRowData<Payment>[] = [
      {
        index: 0,
        isFirstRow: true,
        jointConditions: jointConditions,
        columns: columns,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: "",
          isSystem: false,
          isChangeable: true,
        },
        localization: LOCALIZATION_JA,
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
        localization: LOCALIZATION_JA,
        systemFilter: undefined,
        defaultFilter: { status: { eq: "pending" } },
      }),
    );

    act(() => {
      result.current.resetFilterHandler();
    });

    const expectedValue: FilterRowData<Payment>[] = [
      {
        index: 0,
        isFirstRow: true,
        jointConditions: jointConditions,
        columns: columns,
        currentState: {
          column: "status",
          value: "pending",
          condition: "eq",
          jointCondition: undefined,
          isSystem: false,
          isChangeable: false,
        },
        localization: LOCALIZATION_JA,
      },
      {
        index: 1,
        isFirstRow: false,
        jointConditions: jointConditions,
        columns: columns,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: "",
          isSystem: false,
          isChangeable: true,
        },
        localization: LOCALIZATION_JA,
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
        localization: LOCALIZATION_JA,
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: { amount: { eq: 200 } },
      }),
    );

    act(() => {
      result.current.resetFilterHandler();
    });

    const expectedValue: FilterRowData<Payment>[] = [
      {
        index: 0,
        isFirstRow: true,
        jointConditions: jointConditions,
        columns: columns,
        currentState: {
          column: "status",
          value: "pending",
          condition: "eq",
          jointCondition: undefined,
          isSystem: true,
          isChangeable: false,
        },
        localization: LOCALIZATION_JA,
      },
      {
        index: 1,
        isFirstRow: true,
        jointConditions: jointConditions,
        columns: columns,
        currentState: {
          column: "amount",
          value: 200,
          condition: "eq",
          jointCondition: "and",
          isSystem: false,
          isChangeable: false,
        },
        localization: LOCALIZATION_JA,
      },
      {
        index: 2,
        isFirstRow: false,
        jointConditions: jointConditions,
        columns: columns,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: "and",
          isSystem: false,
          isChangeable: false,
        },
        localization: LOCALIZATION_JA,
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
        localization: LOCALIZATION_JA,
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: { amount: { eq: 200 } },
      }),
    );

    act(() => {
      result.current.deleteFilterRowHandler(1);
    });

    const expectedValue: FilterRowData<Payment>[] = [
      {
        index: 0,
        isFirstRow: true,
        jointConditions: jointConditions,
        columns: columns,
        currentState: {
          column: "status",
          value: "pending",
          condition: "eq",
          jointCondition: undefined,
          isSystem: true,
          isChangeable: false,
        },
        localization: LOCALIZATION_JA,
      },
      {
        index: 1,
        isFirstRow: true,
        jointConditions: jointConditions,
        columns: columns,
        currentState: {
          column: "amount",
          value: 200,
          condition: "eq",
          jointCondition: "and",
          isSystem: false,
          isChangeable: false,
        },
        localization: LOCALIZATION_JA,
      },
      {
        index: 2,
        isFirstRow: false,
        jointConditions: jointConditions,
        columns: columns,
        currentState: {
          column: "",
          value: "",
          condition: "",
          jointCondition: "and",
          isSystem: false,
          isChangeable: false,
        },
        localization: LOCALIZATION_JA,
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
        localization: LOCALIZATION_JA,
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
        LOCALIZATION_EN,
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
        localization: LOCALIZATION_JA,
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
        LOCALIZATION_EN,
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
        localization: LOCALIZATION_JA,
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
        LOCALIZATION_EN,
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
        localization: LOCALIZATION_JA,
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: { amount: { eq: 200 } },
      }),
    );

    const filter: GraphQLQueryFilter = {
      or: {
        status: { eq: "pending" },
      },
    };
    const expectedValue: FilterRowData<Payment>[] = [
      {
        index: 1,
        isFirstRow: false,
        jointConditions: jointConditions,
        columns: columns,
        currentState: {
          column: "status",
          value: "pending",
          condition: "eq",
          jointCondition: "or",
          isSystem: true,
          isChangeable: false,
        },
        localization: LOCALIZATION_JA,
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
        localization: LOCALIZATION_JA,
        systemFilter: { status: { eq: "pending" } },
        defaultFilter: { amount: { eq: 200 } },
      }),
    );

    const filter: GraphQLQueryFilter = {
      amount: { eq: 200 },
    };
    const expectedValue: FilterRowData<Payment>[] = [
      {
        index: 0,
        isFirstRow: true,
        jointConditions: jointConditions,
        columns: columns,
        currentState: {
          column: "amount",
          value: 200,
          condition: "eq",
          jointCondition: undefined,
          isSystem: false,
          isChangeable: false,
        },
        localization: LOCALIZATION_JA,
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
        localization: LOCALIZATION_JA,
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
        LOCALIZATION_EN,
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter,
        graphQLQueryObject,
        "boolean",
        LOCALIZATION_EN,
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter2,
        graphQLQueryObject,
        "string",
        LOCALIZATION_EN,
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter3,
        graphQLQueryObject,
        "string",
        LOCALIZATION_EN,
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter4,
        graphQLQueryObject,
        "string",
        LOCALIZATION_EN,
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter5,
        graphQLQueryObject,
        "number",
        LOCALIZATION_EN,
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
        localization: LOCALIZATION_JA,
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
        LOCALIZATION_EN,
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter,
        graphQLQueryObject,
        "boolean",
        LOCALIZATION_EN,
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter2,
        graphQLQueryObject,
        "string",
        LOCALIZATION_EN,
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter3,
        graphQLQueryObject,
        "string",
        LOCALIZATION_EN,
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter4,
        graphQLQueryObject,
        "string",
        LOCALIZATION_EN,
      );
      result.current.addToGraphQLQueryFilterRecursively(
        filter5,
        graphQLQueryObject,
        "number",
        LOCALIZATION_EN,
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
});
