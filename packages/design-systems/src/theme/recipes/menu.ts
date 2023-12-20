import { menuAnatomy } from "@ark-ui/anatomy";
import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts(menuAnatomy.build());

const baseItemStyle = {
  alignItems: "center",
  borderRadius: "md",
  color: "fg.emphasized",
  cursor: "pointer",
  display: "flex",
  my: "1",
  textStyle: "sm",
  _focus: {
    background: "bg.subtle",
  },
  _selected: {
    background: "bg.subtle",
  },
} as const;

export const menu = defineRecipe({
  className: "menu",
  description: "A menu style",
  base: parts({
    positioner: {
      zIndex: "100",
    },
    separator: {
      borderColor: "fg.subtle",
      borderBottomWidth: "1px",
      my: "1",
    },
    itemGroupLabel: {
      fontWeight: "semibold",
      px: "2.5",
      py: "3",
      textStyle: "sm",
    },
    content: {
      background: "bg.default",
      borderRadius: "l2",
      borderWidth: "1px",
      boxShadow: "lg",
      outline: "none",
      _open: {
        animation: "fadeIn 0.25s ease-out",
      },
    },
    item: {
      ...baseItemStyle,
      px: "2.5",
      py: "2",
    },
    optionItem: {
      ...baseItemStyle,
      "& > *": {
        flex: "1",
        px: "2.5",
        py: "2",
      },
    },
    triggerItem: {
      ...baseItemStyle,
      px: "2.5",
      py: "2",
    },
  }),
});
