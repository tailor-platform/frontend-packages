import { useState } from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LOCALIZATION_EN } from "@locales";
import { DataGridInstance, UseDataGridProps } from "../types";
import { LOCALIZATION_JA } from "../../../../locales/ja";
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
import { newColumnBuilder } from "../column";
import { CustomFilter } from "./CustomFilter";
import type { GraphQLQueryFilter, QueryRow } from "./types";

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

const columnBuilder = newColumnBuilder<Payment>();
const columnDefs = [
  columnBuilder.enum("status", "Status", PaymentStatus),
  columnBuilder.string("email", "Email"),
  columnBuilder.number("amount", "Amount"),
];

type UseDataGridWithFilterProps = {
  customizeDatagrid?: Partial<UseDataGridProps<Payment>>;
  onFilterChange?: (filters: GraphQLQueryFilter | undefined) => void;
};
const useDataGridWithFilter = (
  props?: UseDataGridWithFilterProps,
): DataGridInstance<Payment> => {
  const [data, setData] = useState<Payment[]>(originData);
  const table = useDataGrid({
    data,
    columns: columnDefs,
    enableColumnFilters: true,
    onFilterChange: (filter) => {
      setFilterChange(filter, originData, setData);
      props?.onFilterChange?.(filter);
    },
    localization: LOCALIZATION_JA,
    ...props?.customizeDatagrid,
  });
  return table;
};

const DataGridWithFilter = () => {
  const table = useDataGridWithFilter();
  return <DataGrid table={table} />;
};

const DataGridWithFilterWithSystemFilter = () => {
  const table = useDataGridWithFilter({
    customizeDatagrid: {
      systemFilter: { status: { eq: "pending" } },
    },
  });
  return <DataGrid table={table} />;
};

const DataGridWithFilterWithDefaultFilter = () => {
  const table = useDataGridWithFilter({
    customizeDatagrid: {
      defaultFilter: { amount: { gt: 200 } },
    },
  });
  return <DataGrid table={table} />;
};

const DataGridWithFilterWithSystemAndDefaultFilter = () => {
  const table = useDataGridWithFilter({
    customizeDatagrid: {
      systemFilter: { status: { eq: "pending" } },
      defaultFilter: { amount: { gt: 200 } },
    },
  });
  return <DataGrid table={table} />;
};

const CustomFilterComponent = (props?: UseDataGridWithFilterProps) => {
  const table = useDataGridWithFilter(props);

  return <CustomFilter table={table} columns={columns} />;
};

describe(
  "<CustomFilter />",
  () => {
    it("Renders the component correctly when locale is set as English", () => {
      let currentFilters: GraphQLQueryFilter | undefined = undefined;

      render(
        <CustomFilterComponent
          onFilterChange={(filter) => {
            currentFilters = filter;
          }}
          customizeDatagrid={{
            localization: LOCALIZATION_EN,
          }}
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
      expect(currentFilters).toEqual(undefined);
    });

    it("Renders the component correctly when locale is set as Japanese", () => {
      let currentFilters: GraphQLQueryFilter | undefined = undefined;

      render(
        <CustomFilterComponent
          onFilterChange={(filter) => {
            currentFilters = filter;
          }}
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
      expect(currentFilters).toEqual(undefined);
    });

    it("Renders ENUM type correctly", async () => {
      let currentFilters: GraphQLQueryFilter | undefined = undefined;

      render(
        <CustomFilterComponent
          onFilterChange={(filter) => {
            currentFilters = filter;
          }}
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
        "等しい",
      );
      expect(equalConditionOption).toBeVisible();
      expect(
        within(selectConditionOptions).getByText("等しくない"),
      ).toBeVisible();
      expect(within(selectConditionOptions).queryByText("含む")).toBeNull();

      await user.click(equalConditionOption);

      expect(equalConditionOption).not.toBeVisible();
      expect(selectCondition).toHaveTextContent("等しい");

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

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

      //Check filters
      await waitFor(() => {
        //Wait for the useEffect to update the filters
        expect(currentFilters).toEqual({ and: { status: { eq: "pending" } } });
      });
    });

    it("Renders string type correctly", async () => {
      let currentFilters: GraphQLQueryFilter | undefined = undefined;

      render(
        <CustomFilterComponent
          onFilterChange={(filter) => {
            currentFilters = filter;
          }}
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
        "等しい",
      );
      expect(equalConditionOption).toBeVisible();
      expect(within(selectConditionOptions).getByText("含む")).toBeVisible();
      expect(
        within(selectConditionOptions).queryByText("等しくない"),
      ).toBeNull();

      await user.click(equalConditionOption);

      expect(equalConditionOption).not.toBeVisible();
      expect(selectCondition).toHaveTextContent("等しい");

      // Input value
      const inputValue = screen.getByTestId("select-input-value");
      await user.click(inputValue);
      await user.type(inputValue, "test@test.com");

      expect(inputValue).toHaveValue("test@test.com");

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

      // Check filters
      expect(currentFilters).toEqual({
        and: { email: { eq: "test@test.com" } },
      });
    });

    it("Renders number type correctly", async () => {
      let currentFilters: GraphQLQueryFilter | undefined = undefined;

      render(
        <CustomFilterComponent
          onFilterChange={(filter) => {
            currentFilters = filter;
          }}
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
        "等しい",
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

      expect(within(selectConditionOptions).queryByText("含む")).toBeNull();

      await user.click(equalConditionOption);

      expect(equalConditionOption).not.toBeVisible();
      expect(selectCondition).toHaveTextContent("等しい");

      // Input value
      const inputValue = await screen.findByTestId("select-input-value");
      await user.type(inputValue, "800");

      expect(inputValue).toHaveValue(800);

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

      // Check filters
      expect(currentFilters).toEqual({ and: { amount: { eq: 800 } } });
    });

    it("Renders Date type correctly", async () => {
      let currentFilters: GraphQLQueryFilter | undefined = undefined;

      render(
        <CustomFilterComponent
          onFilterChange={(filter) => {
            currentFilters = filter;
          }}
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
      expect(within(selectConditionOptions).getByText("等しい")).toBeVisible();
      expect(
        within(selectConditionOptions).getByText("より大きい"),
      ).toBeVisible();
      expect(
        within(selectConditionOptions).getByText("より小さい"),
      ).toBeVisible();
      expect(within(selectConditionOptions).getByText("以上")).toBeVisible();

      expect(within(selectConditionOptions).queryByText("含む")).toBeNull();

      await user.click(lteConditionOption);

      expect(lteConditionOption).not.toBeVisible();
      expect(selectCondition).toHaveTextContent("以下");

      //Input value
      const inputValue = screen.getByTestId("select-input-value");
      await user.click(inputValue);
      await user.type(inputValue, "2023-11-14");

      expect(inputValue).toHaveValue("2023-11-14");

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

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
      let currentFilters: GraphQLQueryFilter | undefined = undefined;

      render(
        <CustomFilterComponent
          onFilterChange={(filter) => {
            currentFilters = filter;
          }}
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
        "等しい",
      );
      expect(eqConditionOption).toBeVisible();

      expect(
        within(selectConditionOptions).getByText("等しくない"),
      ).toBeVisible();
      expect(screen.queryByText("含む")).toBeNull();
      expect(screen.queryByText("より大きい")).toBeNull();
      expect(screen.queryByText("より小さい")).toBeNull();
      expect(screen.queryByText("以上")).toBeNull();
      expect(screen.queryByText("以下")).toBeNull();

      expect(screen.queryByText("含む")).toBeNull();

      await user.click(eqConditionOption);

      expect(eqConditionOption).not.toBeVisible();
      expect(selectCondition).toHaveTextContent("等しい");

      //Select value
      const selectValue = screen.getByTestId("select-input-value");
      const selectValueButton = within(selectValue).getByRole("button");
      await user.click(selectValueButton);

      const trueOption = screen.getByRole("option", { name: "はい" });
      expect(trueOption).toBeVisible();
      expect(screen.getByRole("option", { name: "いいえ" })).toBeVisible();

      await user.click(trueOption);

      expect(trueOption).not.toBeVisible();
      expect(selectValue).toHaveTextContent("はい");

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

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
      await selectCondition(screen, user, 0, "等しい");
      //Select value
      await selectValue(screen, user, 0, "pending");

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

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

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

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
      await selectCondition(screen, user, 1, "等しい");
      //Select value
      await selectValue(screen, user, 1, "pending");

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

      // Number of data displayed is 2 items
      expect(await screen.findAllByTestId("datagrid-row")).toHaveLength(2);

      // Reset filter
      await user.click(await screen.findByTestId("reset-filter-button"));
      // Number of data displayed is 6 items

      await user.click(applyButton);

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

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

      // Number of data displayed is 4 items
      expect(await screen.findAllByTestId("datagrid-row")).toHaveLength(4);
    });

    it("dateTime filter convert correctly toISOString", async () => {
      let currentFilters: GraphQLQueryFilter | undefined = undefined;

      render(
        <CustomFilterComponent
          onFilterChange={(filter) => {
            currentFilters = filter;
          }}
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
      expect(within(selectConditionOptions).getByText("等しい")).toBeVisible();
      expect(
        within(selectConditionOptions).getByText("より大きい"),
      ).toBeVisible();
      expect(
        within(selectConditionOptions).getByText("より小さい"),
      ).toBeVisible();
      expect(within(selectConditionOptions).getByText("以上")).toBeVisible();

      expect(within(selectConditionOptions).queryByText("含む")).toBeNull();

      await user.click(lteConditionOption);

      expect(lteConditionOption).not.toBeVisible();
      expect(selectCondition).toHaveTextContent("以下");

      //Input value
      const inputValue = screen.getByTestId("select-input-value");
      await user.click(inputValue);
      await user.type(inputValue, "2023-11-14 23:00");

      expect(inputValue).toHaveValue("2023-11-14T23:00");

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

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

    it("when systemFilter and undefined aren't provided, first row doesn't show Joint Condition", async () => {
      render(<CustomFilterComponent />);

      // wait UI to update
      setTimeout(() => {
        expect(screen.queryByTestId("select-joint-condition")).toHaveStyle({
          visibility: "hidden",
        });
      }, 5000);
    });

    it("when systemFilter isn't provided, first row doesn't show Joint Condition", async () => {
      render(
        <CustomFilterComponent
          customizeDatagrid={{ defaultFilter: { amount: { gt: 200 } } }}
        />,
      );

      // wait UI to update
      setTimeout(() => {
        const elements = screen.getAllByTestId("select-joint-condition");
        elements.forEach((element, i) => {
          // first row doesn't show Joint Condition
          // other rows show Joint Condition
          if (i === 0) {
            expect(element).toHaveStyle({
              visibility: "hidden",
            });
          } else {
            expect(element).toHaveStyle({
              visibility: "visible",
            });
          }
        });
      }, 5000);
    });

    it("when defaultFilter isn't provided, first row doesn't show Joint Condition", async () => {
      render(
        <CustomFilterComponent
          customizeDatagrid={{ systemFilter: { amount: { gt: 200 } } }}
        />,
      );

      setTimeout(() => {
        const elements = screen.getAllByTestId("select-joint-condition");
        elements.forEach((element, i) => {
          // first row doesn't show Joint Condition
          // other rows show Joint Condition
          if (i === 0) {
            expect(element).toHaveStyle({
              visibility: "hidden",
            });
          } else {
            expect(element).toHaveStyle({
              visibility: "visible",
            });
          }
        });
      }, 5000);
    });

    it("when user click IN condition, show up TagsInput", async () => {
      let currentFilters: GraphQLQueryFilter | undefined = undefined;

      const systemFilter: QueryRow = {
        updatedAt: { eq: "2024-05-10 12:00:00" },
      };
      const defaultQuery: QueryRow = {
        status: { eq: "pending" },
      };

      render(
        <CustomFilterComponent
          onFilterChange={(filter) => {
            currentFilters = filter;
          }}
          customizeDatagrid={{
            defaultFilter: defaultQuery,
            systemFilter: systemFilter,
          }}
        />,
      );

      const user = userEvent.setup();

      // Open filter
      await user.click(await screen.findByTestId("datagrid-filter-button"));

      //Select joint condition
      await selectJointCondition(screen, user, 1, "AND");
      //Select column
      await selectColumn(screen, user, 1, "Amount");
      //Select condition
      await selectCondition(screen, user, 1, "に含まれる");

      const inputValue = screen.getByTestId("tags-input-value");

      expect(inputValue).toBeVisible();

      await user.click(inputValue);
      await user.type(inputValue, "200");
      await user.keyboard("{Enter}");

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

      //Check filters
      await waitFor(() => {
        //Wait for the useEffect to update the filters
        expect(currentFilters).toEqual({
          and: {
            updatedAt: { eq: "2024-05-10 12:00:00" },
            and: [{ status: { eq: "pending" } }, { amount: { in: [200] } }],
          },
        });
      });

      await user.click(inputValue);
      await user.type(inputValue, "220");
      await user.keyboard("{Enter}");

      await user.click(applyButton);

      await waitFor(() => {
        //Wait for the useEffect to update the filters
        expect(currentFilters).toEqual({
          and: {
            updatedAt: { eq: "2024-05-10 12:00:00" },
            and: [
              {
                status: { eq: "pending" },
              },
              { amount: { in: [200, 220] } },
            ],
          },
        });
      });
    });

    it("when user click IN condition, show up TagsInput and delete button work correctly", async () => {
      let currentFilters: GraphQLQueryFilter | undefined = undefined;

      const systemFilter: QueryRow = {
        updatedAt: { eq: "2024-05-10 12:00:00" },
      };
      const defaultQuery: QueryRow = {
        status: { eq: "pending" },
      };

      render(
        <CustomFilterComponent
          onFilterChange={(filter) => {
            currentFilters = filter;
          }}
          customizeDatagrid={{
            defaultFilter: defaultQuery,
            systemFilter: systemFilter,
          }}
        />,
      );

      const user = userEvent.setup();

      // Open filter
      await user.click(await screen.findByTestId("datagrid-filter-button"));

      //Select joint condition
      await selectJointCondition(screen, user, 1, "AND");
      //Select column
      await selectColumn(screen, user, 1, "Amount");
      //Select condition
      await selectCondition(screen, user, 1, "に含まれる");

      const inputValue = screen.getByTestId("tags-input-value");

      expect(inputValue).toBeVisible();

      await user.click(inputValue);
      await user.type(inputValue, "200");
      await user.keyboard("{Enter}");

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

      //Check filters
      await waitFor(() => {
        //Wait for the useEffect to update the filters
        expect(currentFilters).toEqual({
          and: {
            updatedAt: { eq: "2024-05-10 12:00:00" },
            and: [{ status: { eq: "pending" } }, { amount: { in: [200] } }],
          },
        });
      });

      const deleteButton = screen.getByTestId("delete-tag-0");
      await user.click(deleteButton);

      await user.click(applyButton);

      await waitFor(() => {
        //Wait for the useEffect to update the filters
        expect(currentFilters).toEqual({
          and: {
            updatedAt: { eq: "2024-05-10 12:00:00" },
            and: [{ status: { eq: "pending" } }, { amount: { in: [] } }],
          },
        });
      });
    });

    it("when user click IN condition, show up TagsInput and clear button work correctly", async () => {
      let currentFilters: GraphQLQueryFilter | undefined = undefined;

      const systemFilter: QueryRow = {
        updatedAt: { eq: "2024-05-10 12:00:00" },
      };
      const defaultQuery: QueryRow = {
        status: { eq: "pending" },
      };

      render(
        <CustomFilterComponent
          onFilterChange={(filter) => {
            currentFilters = filter;
          }}
          customizeDatagrid={{
            defaultFilter: defaultQuery,
            systemFilter: systemFilter,
          }}
        />,
      );

      const user = userEvent.setup();

      // Open filter
      await user.click(await screen.findByTestId("datagrid-filter-button"));

      //Select joint condition
      await selectJointCondition(screen, user, 1, "AND");
      //Select column
      await selectColumn(screen, user, 1, "Amount");
      //Select condition
      await selectCondition(screen, user, 1, "に含まれる");

      const inputValue = screen.getByTestId("tags-input-value");

      expect(inputValue).toBeVisible();

      await user.click(inputValue);
      await user.type(inputValue, "200");
      await user.keyboard("{Enter}");

      const deleteButton = screen.getByTestId("clear-tags");
      await user.click(deleteButton);

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

      await waitFor(() => {
        //Wait for the useEffect to update the filters
        expect(currentFilters).toEqual({
          and: {
            updatedAt: {
              eq: "2024-05-10 12:00:00",
            },
            and: [
              {
                status: {
                  eq: "pending",
                },
              },
              {
                amount: {
                  in: [],
                },
              },
            ],
          },
        });
      });
    });

    it("after setting an input type filter, when changing the column, the input value is empty", async () => {
      let currentFilters: GraphQLQueryFilter | undefined = undefined;

      render(
        <CustomFilterComponent
          onFilterChange={(filter) => {
            currentFilters = filter;
          }}
        />,
      );

      const user = userEvent.setup();

      // Open filter
      await user.click(await screen.findByTestId("datagrid-filter-button"));

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
        "等しい",
      );
      expect(equalConditionOption).toBeVisible();
      expect(within(selectConditionOptions).getByText("含む")).toBeVisible();
      expect(
        within(selectConditionOptions).queryByText("等しくない"),
      ).toBeNull();

      await user.click(equalConditionOption);

      expect(equalConditionOption).not.toBeVisible();
      expect(selectCondition).toHaveTextContent("等しい");

      const inputValue = screen.getByTestId("select-input-value");
      await user.click(inputValue);
      await user.type(inputValue, "test@test.com");
      await user.click(equalConditionOption);

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

      await waitFor(() => {
        //Wait for the useEffect to update the filters
        expect(currentFilters).toEqual({
          and: {
            email: { eq: "test@test.com" },
          },
        });
      });

      await user.click(selectColumnButton);

      const amountOption = within(selectColumnOptions).getByText("Amount");
      expect(amountOption).toBeVisible();

      await user.click(amountOption);

      await user.click(applyButton);

      await waitFor(() => {
        //Wait for the useEffect to update the filters
        expect(currentFilters).toEqual(undefined);
      });
    });

    it("When the default filter for input type is set, when changing the column, the input value is empty", async () => {
      let currentFilters: GraphQLQueryFilter | undefined = undefined;
      const defaultQuery: QueryRow = {
        email: { eq: "test@test.com" },
      };

      render(
        <CustomFilterComponent
          onFilterChange={(filter) => {
            currentFilters = filter;
          }}
          customizeDatagrid={{
            defaultFilter: defaultQuery,
          }}
        />,
      );

      const user = userEvent.setup();

      // Open filter
      await user.click(await screen.findByTestId("datagrid-filter-button"));

      // Select column
      const selectColumn = screen.getAllByTestId("select-column")[0];
      const selectColumnOptions = screen.getAllByTestId(
        "select-column-options",
      )[0];
      const selectColumnButton = within(selectColumn).getByRole("button");
      await user.click(selectColumnButton);
      const amountOption = within(selectColumnOptions).getByText("Amount");
      expect(amountOption).toBeVisible();

      await user.click(amountOption);

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

      await waitFor(() => {
        //Wait for the useEffect to update the filters
        expect(currentFilters).toEqual(undefined);
      });
    });

    it("When the default filter for input type is set, when clear filter, the input value is empty", async () => {
      let currentFilters: GraphQLQueryFilter | undefined = undefined;
      const defaultQuery: QueryRow = {
        email: { eq: "test@test.com" },
      };

      render(
        <CustomFilterComponent
          onFilterChange={(filter) => {
            currentFilters = filter;
          }}
          customizeDatagrid={{
            defaultFilter: defaultQuery,
          }}
        />,
      );

      const user = userEvent.setup();

      // Open filter
      await user.click(await screen.findByTestId("datagrid-filter-button"));

      // Clear filter
      await user.click(screen.getByTestId("reset-clear-button"));

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

      await waitFor(() => {
        //Wait for the useEffect to update the filters
        expect(currentFilters).toEqual(undefined);
      });
    });

    it("When defaultFilter is set, filterBadge show that numberOfSearchConditions is 1", async () => {
      render(<DataGridWithFilterWithDefaultFilter />);
      await waitFor(() => {
        expect(screen.getByTestId("filter-badge")).toHaveTextContent("1");
      });
    });

    it("When defaultFilter is not set, filterBadge is hidden", async () => {
      render(<DataGridWithFilter />);
      expect(await screen.findByTestId("filter-badge")).toHaveStyle({
        visibility: "hidden",
      });
    });

    it("filterBadge show numberOfSearchConditions correctly", async () => {
      render(<DataGridWithFilterWithDefaultFilter />);

      const user = userEvent.setup();

      // Open filter
      await user.click(await screen.findByTestId("datagrid-filter-button"));

      //Select joint condition
      await selectJointCondition(screen, user, 1, "AND");
      //Select column
      await selectColumn(screen, user, 1, "Status");
      //Select condition
      await selectCondition(screen, user, 1, "等しい");
      //Select value
      await selectValue(screen, user, 1, "pending");

      const applyButton = screen.getByTestId("filter-apply-button");
      await user.click(applyButton);

      expect(await screen.findByTestId("filter-badge")).toHaveTextContent("2");

      // Reset filter
      await user.click(await screen.findByTestId("reset-filter-button"));

      await user.click(applyButton);
      expect(await screen.findByTestId("filter-badge")).toHaveTextContent("1");
    });

    it("If don't click apply button and close modal, UI shows prev filterRow", async () => {
      render(
        <CustomFilterComponent
          onFilterChange={() => {
            return;
          }}
        />,
      );

      const user = userEvent.setup();

      // Open filter
      await user.click(await screen.findByTestId("datagrid-filter-button"));

      //Select column
      await selectColumn(screen, user, 0, "Status");
      //Select condition
      await selectCondition(screen, user, 0, "等しい");
      //Select value
      await selectValue(screen, user, 0, "pending");

      // Close modal
      await user.click(screen.getByTestId("datagrid-filter-button"));

      // Open filter
      await user.click(await screen.findByTestId("datagrid-filter-button"));

      // Check filterRow
      const columnElement = screen.getByTestId("select-column");
      const conditionElement = screen.getByTestId("select-condition");
      const valueElement = screen.getByTestId("select-input-value");

      expect(columnElement).not.toEqual("Status");
      expect(conditionElement).not.toEqual("等しい");
      expect(valueElement).not.toEqual("pending");
    });
  },

  { timeout: 10000 },
);
