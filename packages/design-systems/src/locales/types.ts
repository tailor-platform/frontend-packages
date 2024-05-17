export interface Localization {
  language: string;
  datagrid: {
    noResults: string;
  };
  filter: {
    filterLabel: string;
    filterResetLabel: string;
    filterClearLabel: string;
    addNewFilterLabel: string;
    jointConditionLabel: string;
    jointConditionPlaceholder: string;
    columnLabel: string;
    columnPlaceholder: string;
    condition: {
      conditionLabel: string;
      conditionPlaceholder: string;
      operatorLabel: {
        equal: string;
        notEqual: string;
        include: string;
        notInclude: string;
        greaterThan: string;
        lessThan: string;
        greaterThanOrEqual: string;
        lessThanOrEqual: string;
        in: string;
      };
    };
    valueLabel: string;
    valuePlaceholder: string;
    valuePlaceholderEnum: string;
    validationErrorDate: string;
  };
  columnFeatures: {
    hideShow: {
      showAll: string;
    };
    pinnedColumn: {
      pinnedRight: string;
      pinnedLeft: string;
      unPin: string;
    };
  };
  pagination: {
    rowsPerPage: string;
    of: string;
    page: string;
  };
  density: {
    densityLabel: string;
    compact: string;
    standard: string;
    comfortable: string;
  };
  export: {
    exportLabel: string;
    exportCSV: string;
  };
}
