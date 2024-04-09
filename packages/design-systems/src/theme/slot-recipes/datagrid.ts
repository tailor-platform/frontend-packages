import { defineSlotRecipe } from "@pandacss/dev";

export const datagrid = defineSlotRecipe({
  className: "datagrid",
  slots: [
    "wrapper",
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
    wrapper: {
      w: "full",
      overflow: "auto",
      borderWidth: "0.5px",
      borderColor: "border.default",
      borderRight: "none",
      borderLeft: "none",
    },
    table: {
      backgroundColor: "canvas.base",
      width: "100%",
      borderWidth: "0.5px",
      borderColor: "border.default",
      tableLayout: "fixed",
      borderTop: "none",
      borderBottom: "none",
      borderCollapse: "collapse",
      borderSpacing: "0",
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
      backgroundColor: {
        base: "white",
        _dark: "rgb(10, 10, 10)",
      },
      borderTop: "none",
      borderLeft: "none",
      borderWidth: "0.5px",
      borderColor: "border.default",
      position: "sticky",
      top: "0",
      _before: {
        content: "",
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "border.default",
        zIndex: "-1",
      },
      _last: {
        borderRight: "none",
      },
    },
    tableBody: {
      position: "relative",
      zIndex: 0,
    },
    tableData: {
      borderLeft: "none",
      borderBottom: "none",
      borderWidth: "0.5px",
      borderColor: "border.default",
      wordBreak: "break-word",
      _last: {
        borderRight: "none",
      },
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
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      xs: {
        wrapper: {
          maxHeight: "xs",
        },
      },
      sm: {
        wrapper: {
          maxHeight: "sm",
        },
      },
      md: {
        wrapper: {
          maxHeight: "md",
        },
      },
      lg: {
        wrapper: {
          maxHeight: "lg",
        },
      },
      xl: {
        wrapper: {
          maxHeight: "xl",
        },
      },
      "2xl": {
        wrapper: {
          maxHeight: "2xl",
        },
      },
      "3xl": {
        wrapper: {
          maxHeight: "3xl",
        },
      },
      "4xl": {
        wrapper: {
          maxHeight: "4xl",
        },
      },
      "5xl": {
        wrapper: {
          maxHeight: "5xl",
        },
      },
      "6xl": {
        wrapper: {
          maxHeight: "6xl",
        },
      },
      "7xl": {
        wrapper: {
          maxHeight: "7xl",
        },
      },
      "8xl": {
        wrapper: {
          maxHeight: "8xl",
        },
      },
      full: {
        wrapper: {
          maxHeight: "full",
        },
      },
    },
  },
  jsx: ["DataGrid"],
});
