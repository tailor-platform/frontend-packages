import { defineSlotRecipe } from "@pandacss/dev";

export const sorting = defineSlotRecipe({
  className: "sorting",
  description: "A sorting styles for datagrid",
  slots: ["wrapper", "icon"],
  base: {
    wrapper: {
      cursor: "pointer",
      marginLeft: "1",
    },
    icon: {
      width: "16px",
    },
  },
  variants: {
    color: {
      muted: {
        icon: {
          color: {
            base: "gray",
            _dark: "gray",
          },
        },
      },
    },
  },
});
