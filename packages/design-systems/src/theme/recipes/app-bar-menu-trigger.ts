import { defineSlotRecipe } from "@pandacss/dev";

export const appBarMenuTrigger = defineSlotRecipe({
  className: "appBarMenuTrigger",
  slots: ["root", "content"],
  description: "A app bar menu trigger styles",
  base: {
    root: {
      _focus: {
        outline: "none",
      },
    },
    content: {
      alignItems: "center",
      fontSize: "xs",
      fontWeight: "bold",
      gap: "2",
    },
  },
});
