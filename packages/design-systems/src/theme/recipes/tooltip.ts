import { tooltipAnatomy } from "@ark-ui/anatomy";
import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts(tooltipAnatomy.build());

export const tooltip = defineRecipe({
  className: "tooltip",
  description: "A tooltip style",
  base: parts({
    content: {
      background: "fg.default",
      borderRadius: "l2",
      boxShadow: "sm",
      color: "bg.default",
      fontWeight: "semibold",
      px: "3",
      py: "2",
      textStyle: "xs",
      maxWidth: "2xs",
      _open: {
        animation: "fadeIn 0.25s ease-out",
      },
    },
  }),
});
