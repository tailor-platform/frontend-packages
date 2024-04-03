import { defineSlotRecipe } from "@pandacss/dev";

export const datagrid = defineSlotRecipe({
  className: "datagrid",
  slots: [
    "table",
    "tableHeader",
    "tableRow",
    "tableHead",
    "tableBody",
    "tableData",
    "tableHeadDivider",
  ],
  description: "An datagrid style",
  base: {
    table: {
      backgroundColor: "canvas.base",
      width: "100%",
      borderWidth: "0.5px",
      borderColor: "border.default",
      tableLayout: "fixed",
    },
    tableHeader: {
      position: "relative",
      zIndex: 1,
    },
    tableRow: {
      fontSize: "12px",
      height: "30px",
      p: 1,
    },
    tableHead: {
      position: "relative",
      borderWidth: "0.5px",
      borderColor: "border.default",
    },
    tableBody: {
      position: "relative",
      zIndex: 0,
    },
    tableData: {
      borderWidth: "0.5px",
      borderColor: "border.default",
      wordBreak: "break-word",
    },
    tableHeadDivider: {
      position: "absolute",
      top: 0,
      right: 0,
      height: "100%",
      width: "4px",
      background: "rgba(0, 0, 0, 0.5)",
      cursor: "col-resize",
      userSelect: "none",
      touchAction: "none",
      opacity: 0, //Hide by default
      _hover: {
        opacity: 1, //Show on hover
      },
    },
  },
});
