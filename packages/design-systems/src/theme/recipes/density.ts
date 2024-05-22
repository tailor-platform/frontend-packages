import { defineRecipe } from "@pandacss/dev";

export const density = defineRecipe({
  className: "density",
  description: "An datagrid density style",
  base: {},
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      sm: {
        height: "auto",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
      },
      md: {
        paddingTop: "1rem",
        paddingBottom: "1rem",
      },
      lg: {
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
      },
    },
  },
});
