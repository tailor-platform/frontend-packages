import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Column, GraphQLQueryFilter } from "../types";
import "@testing-library/jest-dom/vitest"; //For userEvent used for clicks etc. DONT use fireEvent for clicks etc. as it might not work properly with select elements
import { LOCALIZATION_JA } from "../locales/ja";
import { LOCALIZATION_EN } from "../locales/en";
import {
  addFilter,
  deleteFilter,
  inputValue,
  resetAllFilters,
  selectColumn,
  selectCondition,
  selectJointCondition,
  selectValue,
} from "../utils/test/customFilter";
import { CustomFilter } from "./CustomFilter";

/* eslint-disable-next-line @typescript-eslint/no-empty-function */
window.HTMLElement.prototype.scrollTo = function () {}; //(https://github.com/jsdom/jsdom/issues/1695)
/* eslint-disable-next-line @typescript-eslint/no-empty-function */
window.HTMLElement.prototype.scrollIntoView = function () {}; //(https://github.com/jsdom/jsdom/issues/1695)

enum PaymentStatus {
  pending = "pending",
  processing = "processing",
  success = "success",
  failed = "failed",
}

type Payment = {
  id: string;
  amount: number;
  status: PaymentStatus;
  email: string;
  createdAt: string;
  isCreditCard: boolean;
};

const columns: Column<Payment>[] = [
  {
    label: "Status",
    value: "Status",
    meta: {
      type: "enum",
      enumType: PaymentStatus,
      accessorKey: "status",
    },
    disabled: false,
  },
  {
    label: "Email",
    value: "Email",
    meta: {
      type: "string",
      accessorKey: "email",
    },
    disabled: false,
  },
  {
    label: "Amount",
    value: "Amount",
    meta: {
      type: "number",
      accessorKey: "amount",
    },
    disabled: false,
  },
  {
    label: "CreatedAt",
    value: "CreatedAt",
    meta: {
      type: "date",
      accessorKey: "createdAt",
    },
    disabled: false,
  },
  {
    label: "CreditCardUsed",
    value: "CreditCardUsed",
    meta: {
      type: "boolean",
      accessorKey: "isCreditCard",
    },
    disabled: false,
  },
];

describe("<CustomFilter />", () => {
  it("Renders the component correctly when locale is set as English", () => {
    let currentFilters: GraphQLQueryFilter = {};
    render(
      <CustomFilter
        columns={columns}
        onChange={(currentState: GraphQLQueryFilter) => {
          currentFilters = currentState;
        }}
        localization={LOCALIZATION_EN}
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
    expect(currentFilters).toEqual({});
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
      />,
    );
    expect(screen.getByText("フィルタをリセット")).toBeVisible();
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
    expect(currentFilters).toEqual({});
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
    const selectValueOptions = screen.getByTestId("select-input-value-options");
    const selectValueButton = within(selectValue).getByRole("button");
    await user.click(selectValueButton);

    const pendingValueOption = within(selectValueOptions).getByText("pending");
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
      expect(currentFilters).toEqual({ status: { eq: "pending" } });
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
    expect(currentFilters).toEqual({ email: { eq: "test@test.com" } });
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
    expect(currentFilters).toEqual({ amount: { eq: "800" } });
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

    const lteConditionOption = within(selectConditionOptions).getByText("以下");
    expect(lteConditionOption).toBeVisible();
    expect(within(selectConditionOptions).getByText("に等しい")).toBeVisible();
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
        { createdAt: { lte: "2023-11-14" } }, //Returned date is in 2023-11-14 format
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
      expect(currentFilters).toEqual({ isCreditCard: { eq: "true" } });
    });
  });

  it("Multiple filter types woks correctly (type AND)", async () => {
    let currentFilters: GraphQLQueryFilter = {};

    render(
      <CustomFilter
        columns={columns}
        onChange={(currentState: GraphQLQueryFilter) => {
          currentFilters = currentState;
        }}
        localization={LOCALIZATION_JA}
      />,
    );

    const user = userEvent.setup();

    //Select column
    await selectColumn(screen, user, 0, "CreditCardUsed");
    //Select condition
    await selectCondition(screen, user, 0, "に等しい");
    //Select value
    await selectValue(screen, user, 0, "true");

    //Check filters
    await waitFor(() => {
      //Wait for the useEffect to update the filters
      expect(currentFilters).toEqual({ isCreditCard: { eq: "true" } });
    });

    //Add new filter row
    await addFilter(screen, user);

    //Select joint condition
    await selectJointCondition(screen, user, 1, "AND");
    //Select column
    await selectColumn(screen, user, 1, "Status");
    //Select condition
    await selectCondition(screen, user, 1, "に等しい");
    //Select value
    await selectValue(screen, user, 1, "success");

    //Add new filter row
    await addFilter(screen, user);

    //Select joint condition
    await selectJointCondition(screen, user, 2, "AND");

    //Select column
    await selectColumn(screen, user, 2, "CreatedAt");
    //Select condition
    await selectCondition(screen, user, 2, "以下");
    //Input value
    await inputValue(screen, user, 2, "2023-11-14");

    //Add new filter row
    await addFilter(screen, user);

    //Select joint condition
    await selectJointCondition(screen, user, 3, "AND");
    //Select column
    await selectColumn(screen, user, 3, "Email");
    //Select condition
    await selectCondition(screen, user, 3, "に等しい");
    //Select value
    await inputValue(screen, user, 3, "test@test.com");

    //Add new filter row
    await addFilter(screen, user);

    //Select joint condition
    await selectJointCondition(screen, user, 4, "AND");
    //Select column
    await selectColumn(screen, user, 4, "Amount");
    //Select condition
    await selectCondition(screen, user, 4, "以上");
    //Input value
    await inputValue(screen, user, 4, "800");

    //Check filters
    await waitFor(() => {
      //Wait for the useEffect to update the filters
      expect(currentFilters).toEqual({
        isCreditCard: { eq: "true" },
        and: {
          status: { eq: "success" },
          and: {
            createdAt: { lte: "2023-11-14" },
            and: {
              email: { eq: "test@test.com" },
              and: {
                amount: { gte: "800" },
              },
            },
          },
        },
      });
    });
  });

  it("Multiple filter types woks correctly (type OR)", async () => {
    let currentFilters: GraphQLQueryFilter = {};

    render(
      <CustomFilter
        columns={columns}
        onChange={(currentState: GraphQLQueryFilter) => {
          currentFilters = currentState;
        }}
        localization={LOCALIZATION_JA}
      />,
    );

    const user = userEvent.setup();

    //Select column
    await selectColumn(screen, user, 0, "CreditCardUsed");
    //Select condition
    await selectCondition(screen, user, 0, "に等しい");
    //Select value
    await selectValue(screen, user, 0, "true");

    //Check filters
    await waitFor(() => {
      //Wait for the useEffect to update the filters
      expect(currentFilters).toEqual({ isCreditCard: { eq: "true" } });
    });

    //Add new filter row
    await addFilter(screen, user);

    //Select joint condition
    await selectJointCondition(screen, user, 1, "OR");
    //Select column
    await selectColumn(screen, user, 1, "Status");
    //Select condition
    await selectCondition(screen, user, 1, "に等しい");
    //Select value
    await selectValue(screen, user, 1, "success");

    //Add new filter row
    await addFilter(screen, user);

    //Select joint condition
    await selectJointCondition(screen, user, 2, "OR");
    //Select column
    await selectColumn(screen, user, 2, "CreatedAt");
    //Select condition
    await selectCondition(screen, user, 2, "以下");
    //Input value
    await inputValue(screen, user, 2, "2023-11-14");

    //Add new filter row
    await addFilter(screen, user);

    //Select joint condition
    await selectJointCondition(screen, user, 3, "OR");
    //Select column
    await selectColumn(screen, user, 3, "Email");
    //Select condition
    await selectCondition(screen, user, 3, "に等しい");
    //Select value
    await inputValue(screen, user, 3, "test@test.com");

    //Add new filter row
    await addFilter(screen, user);

    //Select joint condition
    await selectJointCondition(screen, user, 4, "OR");
    //Select column
    await selectColumn(screen, user, 4, "Amount");
    //Select condition
    await selectCondition(screen, user, 4, "以上");
    //Input value
    await inputValue(screen, user, 4, "800");

    //Check filters
    await waitFor(() => {
      //Wait for the useEffect to update the filters
      expect(currentFilters).toEqual({
        isCreditCard: { eq: "true" },
        or: {
          status: { eq: "success" },
          or: {
            createdAt: { lte: "2023-11-14" },
            or: {
              email: { eq: "test@test.com" },
              or: {
                amount: { gte: "800" },
              },
            },
          },
        },
      });
    });
  });

  it("Can delete a filter row", async () => {
    let currentFilters: GraphQLQueryFilter = {};

    render(
      <CustomFilter
        columns={columns}
        onChange={(currentState: GraphQLQueryFilter) => {
          currentFilters = currentState;
        }}
        localization={LOCALIZATION_JA}
      />,
    );

    const user = userEvent.setup();

    //Select column
    await selectColumn(screen, user, 0, "CreditCardUsed");
    //Select condition
    await selectCondition(screen, user, 0, "に等しい");
    //Select value
    await selectValue(screen, user, 0, "true");

    //Check filters
    await waitFor(() => {
      //Wait for the useEffect to update the filters
      expect(currentFilters).toEqual({ isCreditCard: { eq: "true" } });
    });

    //Add new filter row
    await addFilter(screen, user);

    //Select joint condition
    await selectJointCondition(screen, user, 1, "AND");
    //Select column
    await selectColumn(screen, user, 1, "Status");
    //Select condition
    await selectCondition(screen, user, 1, "に等しい");
    //Select value
    await selectValue(screen, user, 1, "success");

    //Check filters
    await waitFor(() => {
      //Wait for the useEffect to update the filters
      expect(currentFilters).toEqual({
        isCreditCard: { eq: "true" },
        and: { status: { eq: "success" } },
      });
    });

    //Delete filter row
    await deleteFilter(screen, user, 1);

    //Check filters
    await waitFor(() => {
      //Wait for the useEffect to update the filters
      expect(currentFilters).toEqual({ isCreditCard: { eq: "true" } });
    });
  });

  it("Can reset all filter rows", async () => {
    let currentFilters: GraphQLQueryFilter = {};

    render(
      <CustomFilter
        columns={columns}
        onChange={(currentState: GraphQLQueryFilter) => {
          currentFilters = currentState;
        }}
        localization={LOCALIZATION_JA}
      />,
    );

    const user = userEvent.setup();

    //Select column
    await selectColumn(screen, user, 0, "CreditCardUsed");
    //Select condition
    await selectCondition(screen, user, 0, "に等しい");
    //Select value
    await selectValue(screen, user, 0, "true");

    //Check filters
    await waitFor(() => {
      //Wait for the useEffect to update the filters
      expect(currentFilters).toEqual({ isCreditCard: { eq: "true" } });
    });

    //Add new filter row
    await addFilter(screen, user);

    //Select joint condition
    await selectJointCondition(screen, user, 1, "AND");
    //Select column
    await selectColumn(screen, user, 1, "Status");
    //Select condition
    await selectCondition(screen, user, 1, "に等しい");
    //Select value
    await selectValue(screen, user, 1, "success");

    //Check filters
    await waitFor(() => {
      //Wait for the useEffect to update the filters
      expect(currentFilters).toEqual({
        isCreditCard: { eq: "true" },
        and: { status: { eq: "success" } },
      });
    });

    //Reset all filter rows
    await resetAllFilters(screen, user);

    //Check filters
    await waitFor(() => {
      //Wait for the useEffect to update the filters
      expect(currentFilters).toEqual({}); //GraphQLQueryFilter is reset
    });
  });
});
