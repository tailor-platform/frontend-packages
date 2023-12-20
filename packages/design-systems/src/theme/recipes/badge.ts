import { defineRecipe } from "@pandacss/dev";

export const badge = defineRecipe({
  className: "badge",
  description: "A badge styles",
  base: {
    borderRadius: "2xl",
    background: {
      base: "status.error.default",
      _dark: "red.500",
    },
    color: {
      base: "white",
      _dark: "white",
    },
    display: "inline-flex",
    fontSize: "10px",
    fontWeight: "bold",
    lineHeight: "1",
    px: "1.5",
    py: "1",
  },
});
