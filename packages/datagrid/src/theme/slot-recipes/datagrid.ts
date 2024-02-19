import { defineSlotRecipe } from "@pandacss/dev";

export const datagrid = defineSlotRecipe({
  className: "datagrid",
  slots: ["table", "tableRow", "tableHead", "tableData", "tableHeadDivider"],
  description: "An datagrid style",
  base: {
    table: {
      backgroundColor: "white",
      width: "100%",
      borderWidth: "0.5px",
      borderColor: "border.default",
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
    tableData: {
      borderWidth: "0.5px",
      borderColor: "border.default",
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
