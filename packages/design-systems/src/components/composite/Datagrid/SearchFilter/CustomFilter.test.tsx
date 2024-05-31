import { useState } from "react";
import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import { ColumnDef } from "@tanstack/react-table";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DataGridInstance, UseDataGridProps } from "../types";
import { LOCALIZATION_JA } from "../../../../locales/ja";
import { LOCALIZATION_EN } from "../../../../locales/en";
import {
  inputValue,
  selectColumn,
  selectCondition,
  selectJointCondition,
  selectValue,
} from "../utils/test/customFilter";
import { useDataGrid } from "../useDataGrid";
import {
  Payment,
  PaymentStatus,
  columns,
  originData,
  setFilterChange,
} from "../utils/test";
import { DataGrid } from "../Datagrid";
import { CustomFilter } from "./CustomFilter";
import type { GraphQLQueryFilter } from "./types";

/* eslint-disable-next-line @typescript-eslint/no-empty-function */
window.HTMLElement.prototype.scrollTo = function () {}; //(https://github.com/jsdom/jsdom/issues/1695)
/* eslint-disable-next-line @typescript-eslint/no-empty-function */
window.HTMLElement.prototype.scrollIntoView = function () {}; //(https://github.com/jsdom/jsdom/issues/1695)

class MockResizeObserver {
  observe(): void {
    // do nothing
  }
  unobserve(): void {
    // do nothing
  }
  disconnect(): void {
    // do nothing
  }
}
global.ResizeObserver = MockResizeObserver;

const columnDefs: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      type: "enum",
      enumType: PaymentStatus,
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: {
      type: "string",
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: {
      type: "number",
    },
  },
];

const useDataGridWithFilter = (
  customizeDatagrid?: Partial<UseDataGridProps<Payment>>,
): DataGridInstance<Payment> => {
  const [data, setData] = useState<Payment[]>(originData);
  const table = useDataGrid({
    data,
    columns: columnDefs,
    enableColumnFilters: true,
    onFilterChange: (filter) => {
      setFilterChange(filter, originData, setData);
    },
    localization: LOCALIZATION_JA,
    ...customizeDatagrid,
  });
  return table;
};

const DataGridWithFilter = () => {
  const table = useDataGridWithFilter();
  return <DataGrid table={table} />;
};

const DataGridWithFilterWithSystemFilter = () => {
  const table = useDataGridWithFilter({
    systemFilter: { status: { eq: "pending" } },
  });
  return <DataGrid table={table} />;
};

const DataGridWithFilterWithDefaultFilter = () => {
  const table = useDataGridWithFilter({
    defaultFilter: { amount: { gt: 200 } },
  });
  return <DataGrid table={table} />;
};

const DataGridWithFilterWithSystemAndDefaultFilter = () => {
  const table = useDataGridWithFilter({
    systemFilter: { status: { eq: "pending" } },
    defaultFilter: { amount: { gt: 200 } },
  });
  return <DataGrid table={table} />;
};

describe(
  "<CustomFilter />",
  () => {
    it("Renders the component correctly when locale is set as English", () => {
      let currentFilters: GraphQLQueryFilter = {};
      render(
        <CustomFilter
          columns={columns}
          onChange={(currentState: GraphQLQueryFilter) => {
            currentFilters = currentState;
          }}
          localization={LOCALIZATION_EN}
          customFilterOpen={true}
          setCustomFilterOpen={() => void 0}
          enableColumnFilters={true}
        />,
      );
      expect(screen.getByText("Reset Filter")).toBeVisible();
      expect(screen.getByText("Column")).toBeVisible();
      expect(screen.getByText("Select Column")).toBeVisible();
      expect(screen.getByText("Condition")).toBeVisible();
      expect(screen.getByText("Select Condition")).toBeVisible();
      expect(screen.getByText("Value")).toBeVisible();
      expect(screen.getByPlaceholderText("Input Value")).toBeVisible();
      expect(
        screen.getByRole("button", {
          name: "Add Filter",
        }),
      ).toBeVisible();

      //Check filters
      expect(currentFilters).toEqual({ and: {} });
    });

    it("Renders the component correctly when locale is set as Japanese", () => {
      let currentFilters: GraphQLQueryFilter = {};
      render(
        <CustomFilter
          columns={columns}
          onChange={(currentState: GraphQLQueryFilter) => {
            currentFilters = currentState;
          }}
          localization={LOCALIZATION_JA}
          customFilterOpen={true}
          setCustomFilterOpen={() => void 0}
          enableColumnFilters={true}
        />,
      );
      expect(screen.getByText("追加したフィルタを削除")).toBeVisible();
      expect(screen.getByText("列")).toBeVisible();
      expect(screen.getByText("列を選択")).toBeVisible();
      expect(screen.getByText("条件")).toBeVisible();
      expect(screen.getByText("条件を選択")).toBeVisible();
      expect(screen.getByText("値")).toBeVisible();
      expect(screen.getByPlaceholderText("値を入力")).toBeVisible();
      expect(
        screen.getByRole("button", {
          name: "条件追加",
        }),
      ).toBeVisible();

      //Check filters
      expect(currentFilters).toEqual({ and: {} });
    });

    it("Renders ENUM type correctly", async () => {
      let currentFilters: GraphQLQueryFilter = {};
      render(
        <CustomFilter
          columns={columns}
          onChange={(currentState: GraphQLQueryFilter) => {
            currentFilters = currentState;
          }}
          localization={LOCALIZATION_JA}
          customFilterOpen={true}
          setCustomFilterOpen={() => void 0}
          enableColumnFilters={true}
        />,
      );

      const user = userEvent.setup();

      //Select column
      const selectColumn = screen.getByTestId("select-column");
      const selectColumnOptions = screen.getByTestId("select-column-options");
      const selectColumnButton = within(selectColumn).getByRole("button");
      await user.click(selectColumnButton);

      const statusOption = within(selectColumnOptions).getByText("Status");
      expect(statusOption).toBeVisible();

      await user.click(statusOption);

      expect(statusOption).not.toBeVisible();
      expect(selectColumn).toHaveTextContent("Status");

      //Select condition
      const selectCondition = screen.getByTestId("select-condition");
      const selectConditionOptions = screen.getByTestId(
        "select-condition-options",
      );
      const selectConditionButton = within(selectCondition).getByRole("button");
      await user.click(selectConditionButton);

      const equalConditionOption = within(selectConditionOptions).getByText(
        "に等しい",
      );
      expect(equalConditionOption).toBeVisible();
      expect(
        within(selectConditionOptions).getByText("に等しくない"),
      ).toBeVisible();
      expect(within(selectConditionOptions).queryByText("を含む")).toBeNull();

      await user.click(equalConditionOption);

      expect(equalConditionOption).not.toBeVisible();
      expect(selectCondition).toHaveTextContent("に等しい");

      //Select value
      const selectValue = screen.getByTestId("select-input-value");
      const selectValueOptions = screen.getByTestId(
        "select-input-value-options",
      );
      const selectValueButton = within(selectValue).getByRole("button");
      await user.click(selectValueButton);

      const pendingValueOption =
        within(selectValueOptions).getByText("pending");
      expect(pendingValueOption).toBeVisible();
      expect(within(selectValueOptions).getByText("processing")).toBeVisible();
      expect(within(selectValueOptions).getByText("success")).toBeVisible();
      expect(within(selectValueOptions).getByText("failed")).toBeVisible();

      await user.click(pendingValueOption);

      expect(pendingValueOption).not.toBeVisible();
      expect(selectValue).toHaveTextContent("pending");

      //Check filters
      await waitFor(() => {
        //Wait for the useEffect to update the filters
        expect(currentFilters).toEqual({ and: { status: { eq: "pending" } } });
      });
    });

    it("Renders string type correctly", async () => {
      let currentFilters: GraphQLQueryFilter = {};

      render(
        <CustomFilter
          columns={columns}
          onChange={(currentState: GraphQLQueryFilter) => {
            currentFilters = currentState;
          }}
          localization={LOCALIZATION_JA}
          customFilterOpen={true}
          setCustomFilterOpen={() => void 0}
          enableColumnFilters={true}
        />,
      );

      const user = userEvent.setup();

      // Select column
      const selectColumn = screen.getByTestId("select-column");
      const selectColumnOptions = screen.getByTestId("select-column-options");
      const selectColumnButton = within(selectColumn).getByRole("button");
      await user.click(selectColumnButton);

      const emailOption = within(selectColumnOptions).getByText("Email");
      expect(emailOption).toBeVisible();

      await user.click(emailOption);

      expect(emailOption).not.toBeVisible();
      expect(selectColumn).toHaveTextContent("Email");

      // Select condition
      const selectCondition = screen.getByTestId("select-condition");
      const selectConditionOptions = screen.getByTestId(
        "select-condition-options",
      );
      const selectConditionButton = within(selectCondition).getByRole("button");
      await user.click(selectConditionButton);

      const equalConditionOption = within(selectConditionOptions).getByText(
        "に等しい",
      );
      expect(equalConditionOption).toBeVisible();
      expect(within(selectConditionOptions).getByText("を含む")).toBeVisible();
      expect(
        within(selectConditionOptions).queryByText("に等しくない"),
      ).toBeNull();

      await user.click(equalConditionOption);

      expect(equalConditionOption).not.toBeVisible();
      expect(selectCondition).toHaveTextContent("に等しい");

      // Input value
      const inputValue = screen.getByTestId("select-input-value");
      await user.click(inputValue);
      await user.type(inputValue, "test@test.com");

      expect(inputValue).toHaveValue("test@test.com");

      // Check filters
      expect(currentFilters).toEqual({
        and: { email: { eq: "test@test.com" } },
      });
    });

    it("Renders number type correctly", async () => {
      let currentFilters: GraphQLQueryFilter = {};

      render(
        <CustomFilter
          columns={columns}
          onChange={(currentState: GraphQLQueryFilter) => {
            currentFilters = currentState;
          }}
          localization={LOCALIZATION_JA}
          customFilterOpen={true}
          setCustomFilterOpen={() => void 0}
          enableColumnFilters={true}
        />,
      );

      const user = userEvent.setup();

      // Select column
      const selectColumn = screen.getByTestId("select-column");
      const selectColumnOptions = screen.getByTestId("select-column-options");
      const selectColumnButton = within(selectColumn).getByRole("button");
      await user.click(selectColumnButton);

      const amountOption = within(selectColumnOptions).getByText("Amount");
      expect(amountOption).toBeVisible();

      await user.click(amountOption);

      expect(amountOption).not.toBeVisible();
      expect(selectColumn).toHaveTextContent("Amount");

      // Select condition
      const selectCondition = screen.getByTestId("select-condition");
      const selectConditionOptions = screen.getByTestId(
        "select-condition-options",
      );
      const selectConditionButton = within(selectCondition).getByRole("button");
      await user.click(selectConditionButton);

      const equalConditionOption = within(selectConditionOptions).getByText(
        "に等しい",
      );
      expect(equalConditionOption).toBeVisible();
      expect(
        within(selectConditionOptions).getByText("より大きい"),
      ).toBeVisible();
      expect(
        within(selectConditionOptions).getByText("より小さい"),
      ).toBeVisible();
      expect(within(selectConditionOptions).getByText("以上")).toBeVisible();
      expect(within(selectConditionOptions).getByText("以下")).toBeVisible();

      expect(within(selectConditionOptions).queryByText("を含む")).toBeNull();

      await user.click(equalConditionOption);

      expect(equalConditionOption).not.toBeVisible();
      expect(selectCondition).toHaveTextContent("に等しい");

      // Input value
      const inputValue = await screen.findByTestId("select-input-value");
      fireEvent.change(inputValue, { target: { value: "800" } });

      expect(inputValue).toHaveValue(800);

      // Check filters
      expect(currentFilters).toEqual({ and: { amount: { eq: 800 } } });
    });

    it("Renders Date type correctly", async () => {
      let currentFilters: GraphQLQueryFilter = {};

      render(
        <CustomFilter
          columns={columns}
          onChange={(currentState: GraphQLQueryFilter) => {
            currentFilters = currentState;
          }}
          localization={LOCALIZATION_JA}
          customFilterOpen={true}
          setCustomFilterOpen={() => void 0}
          enableColumnFilters={true}
        />,
      );

      const user = userEvent.setup();

      //Select column
      const selectColumn = screen.getByTestId("select-column");
      const selectColumnButton = within(selectColumn).getByRole("button");
      await user.click(selectColumnButton);

      const createdAtOption = screen.getByRole("option", { name: "CreatedAt" });
      expect(createdAtOption).toBeVisible();
      await user.click(createdAtOption);
      expect(createdAtOption).not.toBeVisible();
      expect(selectColumn).toHaveTextContent("CreatedAt");

      //Select condition
      const selectCondition = screen.getByTestId("select-condition");
      const selectConditionOptions = screen.getByTestId(
        "select-condition-options",
      );
      const selectConditionButton = within(selectCondition).getByRole("button");
      await user.click(selectConditionButton);

      const lteConditionOption = within(selectConditionOptions).getByText(
        "以下",
      );
      expect(lteConditionOption).toBeVisible();
      expect(
        within(selectConditionOptions).getByText("に等しい"),
      ).toBeVisible();
      expect(
        within(selectConditionOptions).getByText("より大きい"),
      ).toBeVisible();
      expect(
        within(selectConditionOptions).getByText("より小さい"),
      ).toBeVisible();
      expect(within(selectConditionOptions).getByText("以上")).toBeVisible();

      expect(within(selectConditionOptions).queryByText("を含む")).toBeNull();

      await user.click(lteConditionOption);

      expect(lteConditionOption).not.toBeVisible();
      expect(selectCondition).toHaveTextContent("以下");

      //Input value
      const inputValue = screen.getByTestId("select-input-value");
      await user.click(inputValue);
      await user.type(inputValue, "2023-11-14");
      expect(inputValue).toHaveValue("2023-11-14");

      //Check filters
      await waitFor(() => {
        //Wait for the useEffect to update the filters
        expect(currentFilters).toEqual(
          {
            and: {
              createdAt: { lte: "2023-11-14" },
            },
          }, //Returned date is in 2023-11-14 format
        );
      });
    });

    it("Renders Boolean type correctly", async () => {
      let currentFilters: GraphQLQueryFilter = {};

      render(
        <CustomFilter
          columns={columns}
          onChange={(currentState: GraphQLQueryFilter) => {
            currentFilters = currentState;
          }}
          localization={LOCALIZATION_JA}
          customFilterOpen={true}
          setCustomFilterOpen={() => void 0}
          enableColumnFilters={true}
        />,
      );

      const user = userEvent.setup();

      //Select column
      const selectColumn = screen.getByTestId("select-column");
      const selectColumnButton = within(selectColumn).getByRole("button");
      await user.click(selectColumnButton);

      const creditCardUsedOption = screen.getByRole("option", {
        name: "CreditCardUsed",
      });
      expect(creditCardUsedOption).toBeVisible();
      await user.click(creditCardUsedOption);
      expect(creditCardUsedOption).not.toBeVisible();
      expect(selectColumn).toHaveTextContent("CreditCardUsed");

      //Select condition
      const selectCondition = screen.getByTestId("select-condition");
      const selectConditionOptions = screen.getByTestId(
        "select-condition-options",
      );
      const selectConditionButton = within(selectCondition).getByRole("button");
      await user.click(selectConditionButton);

      const eqConditionOption = within(selectConditionOptions).getByText(
        "に等しい",
      );
      expect(eqConditionOption).toBeVisible();

      expect(
        within(selectConditionOptions).getByText("に等しくない"),
      ).toBeVisible();
      expect(screen.queryByText("を含む")).toBeNull();
      expect(screen.queryByText("より大きい")).toBeNull();
      expect(screen.queryByText("より小さい")).toBeNull();
      expect(screen.queryByText("以上")).toBeNull();
      expect(screen.queryByText("以下")).toBeNull();

      expect(screen.queryByText("を含む")).toBeNull();

      await user.click(eqConditionOption);

      expect(eqConditionOption).not.toBeVisible();
      expect(selectCondition).toHaveTextContent("に等しい");

      //Select value
      const selectValue = screen.getByTestId("select-input-value");
      const selectValueButton = within(selectValue).getByRole("button");
      await user.click(selectValueButton);

      const trueOption = screen.getByRole("option", { name: "true" });
      expect(trueOption).toBeVisible();
      expect(screen.getByRole("option", { name: "false" })).toBeVisible();

      await user.click(trueOption);

      expect(trueOption).not.toBeVisible();
      expect(selectValue).toHaveTextContent("true");

      //Check filters
      await waitFor(() => {
        //Wait for the useEffect to update the filters
        expect(currentFilters).toEqual({ and: { isCreditCard: { eq: true } } });
      });
    });

    it("Can works correctly without system and default filter", async () => {
      render(<DataGridWithFilter />);

      const user = userEvent.setup();

      // Number of data displayed is 14 items
      expect(await screen.findAllByTestId("datagrid-row")).toHaveLength(14);

      // Open filter
      await user.click(await screen.findByTestId("datagrid-filter-button"));

      //Select column
      await selectColumn(screen, user, 0, "Status");
      //Select condition
      await selectCondition(screen, user, 0, "に等しい");
      //Select value
      await selectValue(screen, user, 0, "pending");

      // Number of data displayed is 4 items
      expect(await screen.findAllByTestId("datagrid-row")).toHaveLength(4);
    });

    it("System filter works correctly", async () => {
      render(<DataGridWithFilterWithSystemFilter />);

      const user = userEvent.setup();

      // Number of data displayed is 4 items
      expect(await screen.findAllByTestId("datagrid-row")).toHaveLength(4);
      // Open filter
      await user.click(screen.getByTestId("datagrid-filter-button"));
      //Select column
      await selectColumn(screen, user, 0, "Amount");
      //Select condition
      await selectCondition(screen, user, 0, "より大きい");
      //Select value
      await inputValue(screen, user, 0, "200");

      // Number of data displayed is 2 items
      expect(await screen.findAllByTestId("datagrid-row")).toHaveLength(2);
    });

    it("Default filter works correctly", async () => {
      render(<DataGridWithFilterWithDefaultFilter />);

      const user = userEvent.setup();
      // Number of data displayed is 6 items
      expect(await screen.findAllByTestId("datagrid-row")).toHaveLength(6);

      // Open filter
      await user.click(await screen.findByTestId("datagrid-filter-button"));
      // Filter is set to defaultFilter

      //Select joint condition
      await selectJointCondition(screen, user, 1, "AND");
      //Select column
      await selectColumn(screen, user, 1, "Status");
      //Select condition
      await selectCondition(screen, user, 1, "に等しい");
      //Select value
      await selectValue(screen, user, 1, "pending");

      // Number of data displayed is 2 items
      expect(await screen.findAllByTestId("datagrid-row")).toHaveLength(2);

      // Reset filter
      await user.click(await screen.findByTestId("reset-filter-button"));
      // Number of data displayed is 6 items

      expect(await screen.findAllByTestId("datagrid-row")).toHaveLength(6);
    });

    it("System filter and Deafult filter work correctly at the same time", async () => {
      render(<DataGridWithFilterWithSystemAndDefaultFilter />);

      const user = userEvent.setup();
      // Number of data displayed is 2 items
      expect(await screen.findAllByTestId("datagrid-row")).toHaveLength(2);

      // Open filter
      await user.click(await screen.findByTestId("datagrid-filter-button"));
      // Filter is set to defaultFilter

      // Clear filter
      await user.click(screen.getByTestId("reset-clear-button"));

      // Number of data displayed is 4 items
      expect(await screen.findAllByTestId("datagrid-row")).toHaveLength(4);
    });

    it("dateTime filter convert correctly toISOString", async () => {
      let currentFilters: GraphQLQueryFilter = {};

      render(
        <CustomFilter
          columns={columns}
          onChange={(currentState: GraphQLQueryFilter) => {
            currentFilters = currentState;
          }}
          localization={LOCALIZATION_JA}
          customFilterOpen={true}
          setCustomFilterOpen={() => void 0}
          enableColumnFilters={true}
        />,
      );

      const user = userEvent.setup();

      //Select column
      const selectColumn = screen.getByTestId("select-column");
      const selectColumnButton = within(selectColumn).getByRole("button");
      await user.click(selectColumnButton);

      const createdAtOption = screen.getByRole("option", { name: "UpdatedAt" });
      expect(createdAtOption).toBeVisible();
      await user.click(createdAtOption);
      expect(createdAtOption).not.toBeVisible();
      expect(selectColumn).toHaveTextContent("UpdatedAt");

      //Select condition
      const selectCondition = screen.getByTestId("select-condition");
      const selectConditionOptions = screen.getByTestId(
        "select-condition-options",
      );
      const selectConditionButton = within(selectCondition).getByRole("button");
      await user.click(selectConditionButton);

      const lteConditionOption = within(selectConditionOptions).getByText(
        "以下",
      );
      expect(lteConditionOption).toBeVisible();
      expect(
        within(selectConditionOptions).getByText("に等しい"),
      ).toBeVisible();
      expect(
        within(selectConditionOptions).getByText("より大きい"),
      ).toBeVisible();
      expect(
        within(selectConditionOptions).getByText("より小さい"),
      ).toBeVisible();
      expect(within(selectConditionOptions).getByText("以上")).toBeVisible();

      expect(within(selectConditionOptions).queryByText("を含む")).toBeNull();

      await user.click(lteConditionOption);

      expect(lteConditionOption).not.toBeVisible();
      expect(selectCondition).toHaveTextContent("以下");

      //Input value
      const inputValue = screen.getByTestId("select-input-value");
      await user.click(inputValue);
      await user.type(inputValue, "2023-11-14 23:00");
      expect(inputValue).toHaveValue("2023-11-14T23:00");

      //Check filters
      await waitFor(() => {
        //Wait for the useEffect to update the filters
        expect(currentFilters).toEqual(
          {
            and: {
              updatedAt: { lte: "2023-11-14T14:00:00.000Z" },
            },
          }, //Returned dateTime is in toISOString
        );
      });
    });
  },

  { timeout: 10000 },
);
