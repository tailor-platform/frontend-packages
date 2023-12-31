import type { ComponentPropsWithoutRef } from "react";
import { ark } from "@ark-ui/react";
import { styled } from "@tailor-platform/styled-system/jsx";
import { cva, RecipeVariantProps } from "@tailor-platform/styled-system/css";

export const textarea = cva({
  base: {
    appearance: "none",
    background: "none",
    borderColor: "border.default",
    borderRadius: "l2",
    borderWidth: "1px",
    minWidth: 0,
    outline: 0,
    position: "relative",
    transitionDuration: "normal",
    transitionProperty: "border-color, box-shadow",
    width: "full",
    _disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
    _focus: {
      borderColor: "border.accent",
      boxShadow: "accent",
    },
  },
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      sm: { p: "2.5", fontSize: "sm" },
      md: { p: "3", fontSize: "md" },
      lg: { p: "3.5", fontSize: "md" },
      xl: { p: "4", fontSize: "md" },
    },
  },
});
export type TextareaProps = RecipeVariantProps<typeof textarea> &
  ComponentPropsWithoutRef<typeof ark.textarea>;

export const Textarea = styled(ark.textarea, textarea);
