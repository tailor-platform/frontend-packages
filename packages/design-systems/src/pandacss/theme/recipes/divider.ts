import { defineRecipe } from "@pandacss/dev";

export const dividerStyle = defineRecipe({
  className: "dividerStyle",
  description: "A divider style",
  base: {
    width: "full",
    borderBottomWidth: "1px",
  },
});
