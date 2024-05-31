import { Localization } from "./types";
/**
 * English localization
 */
export const LOCALIZATION_EN: Localization = {
  language: "EN",
  datagrid: {
    noResults: "No Results.",
  },
  columnFeatures: {
    hideShow: {
      showAll: "Show All",
    },
    pinnedColumn: {
      pinnedRight: "Pinned Right",
      pinnedLeft: "Pinned Left",
      unPin: "Unpin",
    },
  },
  filter: {
    filterLabel: "Filter",
    filterResetLabel: "Reset Filter",
    filterClearLabel: "Clear Filter",
    addNewFilterLabel: "Add Filter",
    jointConditionLabel: "Joint Condition",
    jointConditionPlaceholder: "Select Joint Condition",
    columnLabel: "Column",
    columnPlaceholder: "Select Column",
    condition: {
      conditionLabel: "Condition",
      conditionPlaceholder: "Select Condition",
      operatorLabel: {
        equal: "Equals",
        notEqual: "Not Equal",
        include: "Includes",
        notInclude: "Not Include",
        greaterThan: "Greater Than",
        lessThan: "Less Than",
        greaterThanOrEqual: "Greater Than Or Equal",
        lessThanOrEqual: "Less Than Or Equal",
      },
    },
    columnBoolean: {
      true: "true",
      false: "false",
    },
    valueLabel: "Value",
    valuePlaceholder: "Input Value",
    valuePlaceholderEnum: "Select Value",
    validationErrorDate: "Invalid Date",
  },
  pagination: {
    rowsPerPage: "Rows per page:",
    of: "of",
    page: "",
  },
  density: {
    densityLabel: "Density",
    compact: "Compact",
    standard: "Standard",
    comfortable: "Comfortable",
  },
  export: {
    exportLabel: "Export",
    exportCSV: "Download as CSV",
  },
};
