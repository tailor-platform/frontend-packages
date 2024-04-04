import { pinInputAnatomy } from "@ark-ui/anatomy";
import { defineSlotRecipe } from "@pandacss/dev";

export const pinInput = defineSlotRecipe({
  className: "pinInput",
  description: "An pin input style",
  slots: [...pinInputAnatomy.keys()],
  base: {
    root: {},
    control: {
      display: "flex",
      gap: "2",
    },
    input: {
      width: 12,
      textAlign: "center",
    },
    label: {},
  },
  defaultVariants: {
    variant: "outline",
    size: "md",
  },
  variants: {
    variant: {
      outline: {
        input: {
          background: "bg.surface",
          borderColor: "border.emphasized",
          borderRadius: "l2",
          borderWidth: "1px",
          color: "fg.default",
          _focus: {
            zIndex: 1,
            "--shadow": {
              base: "colors.blue.400",
              _dark: "colors.blue.400",
            },
            boxShadow: "0 0 0 1px var(--shadow)",
            borderColor: "primary.default",
          },
        },
      },
    },
    size: {
      sm: { input: { px: "2.5", h: "9", minW: "9", textStyle: "sm" } },
      md: { input: { px: "3", h: "10", minW: "10", textStyle: "md" } },
      lg: { input: { px: "3.5", h: "11", minW: "11", textStyle: "md" } },
      xl: { input: { px: "4", h: "12", minW: "12", textStyle: "md" } },
      "2xl": { input: { px: "2", h: "16", minW: "16", textStyle: "3xl" } },
    },
  },
});
