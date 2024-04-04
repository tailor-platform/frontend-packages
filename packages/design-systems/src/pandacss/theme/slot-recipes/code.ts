import { defineSlotRecipe } from "@pandacss/dev";

export const code = defineSlotRecipe({
  className: "code",
  slots: ["root", "code", "copy"],
  description: "A code style",
  jsx: ["Code"],
  base: {
    root: {
      position: "relative",
      "&:hover .code__copy": {
        display: "block",
      },
    },
    code: {
      alignItems: "center",
      bg: "bg.surface",
      borderWidth: "1px",
      borderRadius: "sm",
      borderColor: "border.default",
      color: "fg.emphasized",
      display: "inline-flex",
      fontFamily: "var(--font-mono-code)",
      fontWeight: "500",
      fontSize: "sm",
      minHeight: "6",
      px: "1",
    },
    copy: {
      position: "absolute",
      cursor: "pointer",
      bgColor: "bg.default",
      display: "none",
      borderRadius: "sm",
      top: "0",
      right: "0",
    },
  },
  defaultVariants: {
    variant: "block",
  },

  variants: {
    variant: {
      inline: {
        code: {
          display: "inline-flex",
          height: "6",
        },
      },
      block: {
        code: {
          display: "block",
          whiteSpace: "pre-wrap",
          py: 1,
          px: 2,
        },
        copy: {
          top: "2px",
          right: "2px",
        },
      },
    },
  },
});
