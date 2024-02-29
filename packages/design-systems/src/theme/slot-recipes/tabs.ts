import { tabsAnatomy } from "@ark-ui/anatomy";
import { defineSlotRecipe } from "@pandacss/dev";

export const tabs = defineSlotRecipe({
  className: "tabs",
  description: "A tabs style",
  slots: [...tabsAnatomy.keys()],
  base: {
    root: {
      width: "full",
    },
    list: {
      borderBottomWidth: "1px",
      display: "flex",
      gap: "4",
      height: "8",
      position: "relative",
    },
    trigger: {
      background: "transparent",
      cursor: "pointer",
      color: "fg.muted",
      display: "inline-flex",
      fontWeight: "semibold",
      textStyle: "sm",
      px: "1",
      _hover: {
        color: "fg.emphasized",
      },
      _selected: {
        color: "primary.default",
        _hover: {
          color: "primary.default",
        },
      },
      _disabled: {
        opacity: 0.4,
        cursor: "not-allowed",
      },
    },
    indicator: {
      height: "2px",
      background: "primary.default",
      bottom: "-1px",
    },
    content: {
      background: "brown.700",
      borderRadius: "lg",
      borderWidth: "1px",
      borderTopRightRadius: "0",
      borderTopLeftRadius: "0",
      borderTopWidth: "0px",
      minH: "xl",
      p: "4",
    },
  },
  variants: {
    variant: {
      fill: {
        list: {
          alignItems: "center",
          background: {
            base: "gray.200",
            _dark: "brown.600",
          },
          borderWidth: "1px",
          borderRadius: "lg",
          gap: "6",
          px: "4",
          height: "10",
        },
        trigger: {
          color: "fg.muted",
          fontWeight: "medium",
          _selected: {
            color: "fg.default",
          },
        },
        indicator: {
          background: "primary.default",
        },
      },
    },
  },
});
