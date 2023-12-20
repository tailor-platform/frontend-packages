import { defineSlotRecipe } from "@pandacss/dev";

export const table = defineSlotRecipe({
  className: "checkbox",
  description: "The styles for the Checkbox component",
  slots: ["table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption"],
  base: {
    table: {
      w: "full",
      fontSize: "sm",
      captionSide: "bottom",
    },
    thead: {
      borderBottom: "1px solid",
      borderColor: "border.default",
      textAlign: "left",
      color: "fg.muted",
      tr: {
        _hover: {
          bg: "none",
        },
      },
    },
    tbody: {},
    tfoot: {},
    tr: {
      borderBottom: "1px solid",
      borderColor: "border.default",
      color: "fg.default",
      _last: {
        borderBottom: "0px",
      },
      _hover: {
        bg: "bg.surface",
      },
    },
    th: {
      h: 12,
      px: 4,
      textAlign: "left",
      verticalAlign: "middle",
    },
    td: {
      p: 4,
    },
    caption: {
      color: "fg.muted",
      h: 12,
      mt: 4,
    },
  },
});
