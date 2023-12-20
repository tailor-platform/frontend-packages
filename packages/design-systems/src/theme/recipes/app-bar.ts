import { defineSlotRecipe } from "@pandacss/dev";

export const appBar = defineSlotRecipe({
  className: "appBar",
  slots: ["root", "title"],
  description: "app bar styles",
  base: {
    root: {
      display: "flex",
      justifyContent: "space-between",
      height: "48px",
      px: "4",
      py: "2",
      width: "full",
    },
    title: {
      fontWeight: "bold",
      lineHeight: "32px",
    },
  },
  jsx: ["AppBar"],
});
