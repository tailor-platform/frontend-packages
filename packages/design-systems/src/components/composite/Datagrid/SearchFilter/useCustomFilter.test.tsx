import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LOCALIZATION_JA } from "../../../../locales/ja";
import { Payment, PaymentStatus } from "../utils/test";
import { Column } from "../types";
import { FilterRowData, useCustomFilter } from "./useCustomFilter";
import { jointConditions } from "./filter";

const columns: Column<Payment>[] = [
  {
    accessorKey: "status",
    label: "Status",
    value: "Status",
    meta: {
      type: "enum",
      enumType: PaymentStatus,
    },
    disabled: false,
  },
  {
    accessorKey: "email",
    label: "Email",
    value: "Email",
    meta: {
      type: "string",
    },
    disabled: false,
  },
  {
    accessorKey: "amount",
    label: "Amount",
    value: "Amount",
    meta: {
      type: "number",
    },
    disabled: false,
  },
  {
    accessorKey: "createdAt",
    label: "CreatedAt",
    value: "CreatedAt",
    meta: {
      type: "date",
    },
    disabled: false,
  },
  {
    accessorKey: "isCreditCard",
    label: "CreditCardUsed",
    value: "CreditCardUsed",
    meta: {
      type: "boolean",
    },
    disabled: false,
  },
  {
    accessorKey: "updatedAt",
    label: "UpdatedAt",
    value: "UpdatedAt",
    meta: {
      type: "dateTime",
    },
    disabled: false,
  },
];

describe.only("useCustomFilter", () => {
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
      console.log(result.current.filterRows);
      expect(result.current.filterRows).toStrictEqual(expectedValue);
    });
  });
});
