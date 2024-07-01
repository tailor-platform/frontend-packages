import { useState } from "react";
import { FilterRowData } from "./useCustomFilter";

export const useConfirmedFilterRows = () => {
  const [confirmedFilterRows, setConfirmedFilterRows] = useState<
    FilterRowData[]
  >([]);

  return {
    confirmedFilterRows,
    setConfirmedFilterRows,
    numberOfSearchConditions: getNumberOfSearchConditions(confirmedFilterRows),
  };
};

const getNumberOfSearchConditions = (confirmedFilterRows: FilterRowData[]) => {
  const isCurrentStateValid = (state: FilterRowData) => {
    return (
      state.currentState.column &&
      state.currentState.condition &&
      state.currentState.value
    );
  };
  const count = confirmedFilterRows.reduce((acc, row, index) => {
    // First row does not have jointCondition
    if (
      (index === 0 || row.currentState.jointCondition) &&
      isCurrentStateValid(row)
    ) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return count;
};
