import { defineRecipe } from "@pandacss/dev";

export const link = defineRecipe({
  className: "link",
  description: "A link styles",
  base: {
    transitionProperty: "base",
    transitionDuration: "100",
    transitionTimingFunction: "ease-out",
    cursor: "pointer",
    textDecoration: "none",
    outline: "none",
    _focusVisible: {
      boxShadow: "outline",
    },
  },
  defaultVariants: {},
  variants: {
    variant: {
      sidebar: {
        display: "flex",
        alignSelf: "stretch",
        borderLeftWidth: "1px",
        color: "fg.muted",
        fontWeight: "medium",
        ml: "-1px",
        pl: "4",
        fontSize: { base: "md", lg: "sm" },
        lineHeight: "1.5rem",
        _hover: { color: "fg.default", borderLeftColor: "primary.muted" },
        _currentPage: {
          color: "fg.default",
          fontWeight: "semibold",
          borderColor: "primary.muted",
        },
      },
      toc: {
        display: "flex",
        alignSelf: "stretch",
        color: "fg.muted",
        textStyle: "sm",
        fontWeight: "medium",
        lineHeight: "1.5rem",
        _hover: { color: "fg.default", borderLeftColor: "fg.muted" },
        _currentPage: {
          color: "fg.default",
          fontWeight: "semibold",
          borderColor: "primary.default",
        },
      },
      mdx: {
        color: "fg.emphasized",
        _visited: { color: "fg.emphasized" },
        textDecoration: "underline",
        textDecorationColor: "primary.muted",
        textUnderlineOffset: "0.2em",
      },
    },
  },
});
