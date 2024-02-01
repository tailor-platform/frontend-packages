import { defineRecipe } from "@pandacss/dev";

export const label = defineRecipe({
  className: "label",
  description: "A label styles",
  base: {
    textStyle: "xs",
    fontWeight: "bold",
    lineHeight: "normal",
    color: "fg.emphasized",
    padding: "4px",
    width: "full",
    alignItems: "left",
    backgroundColor: "bg.subtle",
  },
});
