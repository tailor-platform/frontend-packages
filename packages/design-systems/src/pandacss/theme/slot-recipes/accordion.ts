import { accordionAnatomy } from "@ark-ui/anatomy";
import { defineSlotRecipe } from "@pandacss/dev";

export const accordion = defineSlotRecipe({
  className: "accordion",
  slots: accordionAnatomy.keys(),
  description: "An accordion style",
  base: {
    root: {
      width: "100%",
      background: "bg.surface",
      display: "flex",
      flexDirection: "column",
      divideY: "1px",
      p: 4,
    },
    itemTrigger: {
      alignItems: "center",
      background: "transparent",
      borderRadius: "0",
      cursor: "pointer",
      color: "fg.defalut",
      display: "flex",
      fontWeight: "medium",
      justifyContent: "space-between",
      p: 4,
      textStyle: "sm",
      width: "100%",
      "&:not([data-expanded])": {
        pb: "4",
      },
    },
    item: {
      borderColor: "fg.subtle",
      '&:not([hidden]) ~ :not([hidden]) > [data-part="trigger"]': {
        pt: "4",
      },
    },
    itemContent: {
      color: "fg.default",
      p: "4",
      textStyle: "sm",
    },
  },
  defaultVariants: {
    variant: "tertiary",
  },
  variants: {
    variant: {
      primary: {
        itemTrigger: {
          color: "white",
          backgroundColor: "primary.default",
          _disabled: {
            background: "bg.muted",
            color: "fg.placeholder",
            cursor: "not-allowed",
            _hover: {
              background: "bg.disabled",
              color: "fg.placeholder",
            },
          },
          _hover: {
            backgroundColor: "primary.emphasized",
          },
          _focusVisible: {
            zIndex: 1,
            "--shadow": {
              base: "colors.blue.50",
              _dark: "colors.gray.700",
            },
            boxShadow: "0 0 0 4px var(--shadow)",
          },
        },
      },
      secondary: {
        itemTrigger: {
          background: {
            base: "white",
            _dark: "transparent",
          },
          borderWidth: "1px",
          borderColor: "border.emphasized",
          color: "fg.default",
          _hover: {
            color: "fg.default",
            background: "bg.subtle",
            _disabled: {
              borderColor: "border.default",
              background: "bg.surface",
              color: "fg.subtle",
              cursor: "not-allowed",
            },
          },
          _selected: {
            background: "bg.subtle",
          },
          _focusVisible: {
            zIndex: 1,
            "--shadow": {
              base: "colors.gray.100",
              _dark: "colors.gray.800",
            },
            boxShadow: "0 0 0 4px var(--shadow)",
          },
          _disabled: {
            borderColor: "border.default",
            color: "fg.subtle",
            cursor: "not-allowed",
          },
        },
      },
      tertiary: {
        itemTrigger: {
          background: "transparent",
          color: "fg.default",
          _hover: {
            background: "bg.surface",
            _disabled: {
              borderColor: "border.default",
              color: "fg.subtle",
              cursor: "not-allowed",
            },
          },
          _selected: {
            background: "bg.subtle",
          },
          _focusVisible: {
            zIndex: 1,
            "--shadow": {
              base: "colors.gray.100",
              _dark: "colors.gray.800",
            },
            boxShadow: "0 0 0 4px var(--shadow)",
          },
          _disabled: {
            borderColor: "border.default",
            color: "fg.subtle",
            cursor: "not-allowed",
          },
        },
      },
      link: {
        itemTrigger: {
          background: "transparent",
          color: "fg.muted",
          _hover: {
            color: "fg.emphasized",
          },
          _disabled: {
            color: "fg.subtle",
            cursor: "not-allowed",
          },
          height: "auto !important",
          px: "0 !important",
        },
      },
    },
    size: {
      xs: {
        itemTrigger: {
          h: "6",
          minW: "8",
          textStyle: "xs",
          px: "2",
        },
      },
      sm: {
        itemTrigger: {
          h: "8",
          minW: "8",
          textStyle: "sm",
          px: "3.5",
        },
      },
      md: {
        itemTrigger: {
          h: "10",
          minW: "10",
          textStyle: "sm",
          px: "4",
        },
      },
      lg: {
        itemTrigger: {
          h: "11",
          minW: "11",
          px: "4.5",
          textStyle: "md",
        },
      },
      xl: {
        itemTrigger: {
          h: "12",
          minW: "12",
          px: "5",
          textStyle: "md",
        },
      },
      "2xl": {
        itemTrigger: {
          h: "14",
          minW: "14",
          px: "7",
          fontSize: "lg",
        },
      },
    },
  },
});
