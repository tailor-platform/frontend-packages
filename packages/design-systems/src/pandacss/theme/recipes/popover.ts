import { popoverAnatomy } from "@ark-ui/anatomy";
import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts(popoverAnatomy.build());

export const popover = defineRecipe({
  className: "popover",
  description: "A popover style",
  base: parts({
    positioner: {
      background: "bg.surface",
      borderRadius: "lg",
      borderColor: "fg.subtle",
      borderWidth: "1px",
      boxShadow: "lg",
      zIndex: "1",
    },
    content: {
      maxWidth: "sm",
      p: "4",
      position: "relative",
    },
    title: {
      fontWeight: "semibold",
      textStyle: "sm",
    },
    description: {
      color: "fg.muted",
      textStyle: "sm",
    },
    arrow: {
      "--arrow-size": "12px",
      "--arrow-background": {
        base: "white",
        _dark: "colors.gray.950",
      },
    },
    arrowTip: {
      borderTopWidth: "1px",
      borderLeftWidth: "1px",
      borderColor: "fg.subtle",
    },
  }),
});
