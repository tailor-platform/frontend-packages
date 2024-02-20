import { hoverCardAnatomy } from "@ark-ui/anatomy";
import { defineSlotRecipe } from "@pandacss/dev";

export const hoverCard = defineSlotRecipe({
  className: "hoverCard",
  description: "A hover card style",
  slots: hoverCardAnatomy.keys(),
  base: {
    positioner: {
      background: "bg.canvas",
      borderRadius: "lg",
      borderWidth: "1px",
      boxShadow: "xl",
      borderColor: "bg.surface",
      zIndex: "1 !important",
    },
    content: {
      py: 4,
      px: 5,
      position: "relative",
    },
    arrow: {
      "--arrow-size": "12px",
      "--arrow-background": "bg.canvas",
    },
    arrowTip: {
      borderColor: "bg.surface",
      borderTopWidth: "1px",
      borderLeftWidth: "1px",
    },
  },
});
