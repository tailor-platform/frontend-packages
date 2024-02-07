import { checkboxAnatomy } from "@ark-ui/anatomy";
import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts(checkboxAnatomy.build());

export const checkbox = defineRecipe({
  className: "checkbox",
  description: "A checkbox style",
  base: parts({
    root: {
      cursor: "pointer",
      display: "flex",
      gap: "2",
    },
    label: {
      display: "inline-flex",
      flexDirection: "column",
      gap: "0.5",
    },
    control: {
      alignItems: "center",
      background: "bg.surface",
      borderColor: "border.emphasized",
      borderRadius: "md",
      borderWidth: "1px",
      display: "flex",
      height: "5",
      justifyContent: "center",
      width: "5",
      _peerFocusVisible: {
        "--shadow": {
          base: "colors.blue.100",
          _dark: "colors.gray.800",
        },
        boxShadow: "0 0 0 4px var(--shadow)",
      },
      _hover: {
        borderColor: {
          base: "gray.400",
          _dark: "gray.700",
        },
      },
      _checked: {
        background: "primary.default",
        borderColor: "primary.default",
        color: "bg.default",
        _hover: {
          borderColor: "primary.default",
        },
      },
      _indeterminate: {
        borderColor: "primary.default",
        color: "primary.default",
        _hover: {
          borderColor: "primary.default",
        },
      },
    },
  }),
});
