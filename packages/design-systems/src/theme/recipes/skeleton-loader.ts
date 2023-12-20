import { defineRecipe } from "@pandacss/dev";

export const skeletonLoader = defineRecipe({
  className: "skeleton-loader",
  description: "A skeleton loading style",
  base: {
    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    backgroundColor: "bg.subtle",
    borderRadius: "md",
  },
});
