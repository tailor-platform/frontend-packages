import { Localization } from "./types";
/**
 * Japanese localization
 */
export const LOCALIZATION_JA: Localization = {
  language: "JA",
  datagrid: {
    noResults: "表示可能なデータがありません",
  },
  columnFeatures: {
    hideShow: {
      showAll: "全て表示",
    },
    pinnedColumn: {
      pinnedRight: "右に固定",
      pinnedLeft: "左に固定",
      unPin: "元に戻す",
    },
  },
  filter: {
    filterLabel: "フィルタ",
    filterResetLabel: "追加したフィルタを削除",
    filterClearLabel: "全てのフィルタを削除",
    addNewFilterLabel: "条件追加",
    jointConditionLabel: "合致条件",
    jointConditionPlaceholder: "合致条件を選択",
    columnLabel: "列",
    columnPlaceholder: "列を選択",
    condition: {
      conditionLabel: "条件",
      conditionPlaceholder: "条件を選択",
      operatorLabel: {
        equal: "等しい",
        notEqual: "等しくない",
        include: "含む",
        notInclude: "含まない",
        greaterThan: "より大きい",
        lessThan: "より小さい",
        greaterThanOrEqual: "以上",
        lessThanOrEqual: "以下",
      },
    },
    valueLabel: "値",
    valuePlaceholder: "値を入力",
    valuePlaceholderEnum: "値を選択",
    validationErrorDate: "日付が不正です",
  },
  pagination: {
    rowsPerPage: "ぺージあたりの行数",
    of: "件中",
    page: "件",
  },
  density: {
    densityLabel: "行間隔",
    compact: "狭い",
    standard: "標準",
    comfortable: "広い",
  },
  export: {
    exportLabel: "エクスポート",
    exportCSV: "CSVをダウンロード",
  },
};
