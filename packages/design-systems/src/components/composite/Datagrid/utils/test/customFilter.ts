import { within, Screen, waitFor } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event";

/**
 * Selects a column from the dropdown with the given name.
 * @param screen
 * @param user
 * @param columnIndex
 * @param columnName
 */
export const selectColumn = async (
  screen: Screen,
  user: UserEvent,
  columnIndex: number,
  columnName: string,
) => {
  const selectColumn = screen.getAllByTestId("select-column")[columnIndex];
  const selectColumnButton = within(selectColumn).getByRole("button");
  await waitFor(() => user.click(selectColumnButton));
  const option = screen.getByRole("option", { name: columnName });
  await waitFor(() => user.click(option));
};

/**
 * Selects a condition from the dropdown with the given name.
 * @param screen
 * @param user
 * @param conditionIndex
 * @param conditionName
 */
export const selectCondition = async (
  screen: Screen,
  user: UserEvent,
  conditionIndex: number,
  conditionName: string,
) => {
  const selectCondition =
    screen.getAllByTestId("select-condition")[conditionIndex];
  const selectConditionButton = within(selectCondition).getByRole("button");
  await waitFor(() => user.click(selectConditionButton));
  const selectConditionOptions = screen.getAllByTestId(
    "select-condition-options",
  )[conditionIndex];
  const eqConditionOption2 = within(selectConditionOptions).getByText(
    conditionName,
  );
  await waitFor(() => user.click(eqConditionOption2));
};

/**
 * Selects a joint condition from the dropdown with the given name.
 * @param screen
 * @param user
 * @param jointConditionIndex
 * @param jointConditionName
 */
export const selectJointCondition = async (
  screen: Screen,
  user: UserEvent,
  jointConditionIndex: number,
  jointConditionName: string,
) => {
  const selectJointCondition = screen.getAllByTestId("select-joint-condition")[
    jointConditionIndex
  ];
  const selectJointConditionButton =
    within(selectJointCondition).getByRole("button");
  await waitFor(() => user.click(selectJointConditionButton));
  const selectConditionOptions = screen.getAllByTestId(
    "select-joint-condition-options",
  )[jointConditionIndex];
  const conditionOption = within(selectConditionOptions).getByText(
    jointConditionName,
  );
  await waitFor(() => user.click(conditionOption));
};

/**
 * Selects a value from the dropdown with the given name.
 * Used for enum and boolean values
 * @param screen
 * @param user
 * @param valueIndex
 * @param value
 */
export const selectValue = async (
  screen: Screen,
  user: UserEvent,
  valueIndex: number,
  value: string,
) => {
  const selectValue = screen.getAllByTestId("select-input-value")[valueIndex];
  const selectValueButton = within(selectValue).getByRole("button");
  await waitFor(() => user.click(selectValueButton));
  const successOption = screen.getByRole("option", { name: value });
  await waitFor(() => user.click(successOption));
};

/**
 * Inputs a value into the input field with the given value.
 * Used for string and number values
 * @param screen
 * @param user
 * @param valueIndex
 * @param value
 */
export const inputValue = async (
  screen: Screen,
  user: UserEvent,
  valueIndex: number,
  value: string,
) => {
  const inputValue = screen.getAllByTestId("select-input-value")[valueIndex];
  await waitFor(() => user.click(inputValue));
  await user.type(inputValue, value);
};

/**
 * Adds a new filter row
 * @param screen
 * @param user
 */
export const addFilter = async (screen: Screen, user: UserEvent) => {
  const addFilterButton = screen.getByRole("button", { name: "条件追加" });
  await waitFor(() => user.click(addFilterButton));
};

/**
 * Resets all filters
 * @param screen
 * @param user
 */
export const resetAllFilters = async (screen: Screen, user: UserEvent) => {
  const resetAllFiltersButton = screen.getByTestId("reset-filter-button");
  await waitFor(() => user.click(resetAllFiltersButton));
};

/**
 * Deletes a filter row at the given index
 * @param screen
 * @param user
 * @param filterIndex
 */
export const deleteFilter = async (
  screen: Screen,
  user: UserEvent,
  filterIndex: number,
) => {
  const deleteButton = screen.getAllByTestId("delete-filter-row")[filterIndex]; //First delete button is hidden
  await waitFor(() => user.click(deleteButton));
};
