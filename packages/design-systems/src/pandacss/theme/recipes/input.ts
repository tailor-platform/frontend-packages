import { defineRecipe } from "@pandacss/dev";

export const input = defineRecipe({
  className: "input",
  description: "An input style",
  base: {
    width: "100%",
    minWidth: 0,
    outline: 0,
    position: "relative",
    appearance: "none",
    transitionProperty: "base",
    transitionDuration: "100",
    _disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
  defaultVariants: {
    variant: "outline",
    size: "md",
  },
  variants: {
    variant: {
      outline: {
        background: "bg.surface",
        borderColor: "border.emphasized",
        borderRadius: "l2",
        borderWidth: "1px",
        color: "fg.default",
        textAlign: "left",
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
    size: {
      sm: { px: "2.5", h: "9", minW: "9", textStyle: "sm" },
      md: { px: "3", h: "10", minW: "10", textStyle: "md" },
      lg: { px: "3.5", h: "11", minW: "11", textStyle: "md" },
      xl: { px: "4", h: "12", minW: "12", textStyle: "md" },
      "2xl": { px: "2", h: "16", minW: "16", textStyle: "3xl" },
    },
  },
});
