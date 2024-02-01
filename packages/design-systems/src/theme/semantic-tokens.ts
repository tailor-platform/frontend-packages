import { defineSemanticTokens } from "@pandacss/dev";

export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      canvas: {
        value: {
          base: "{colors.gray.25}",
          _dark: "{colors.gray.950}",
        },
      },
      default: {
        value: { base: "{colors.white}", _dark: "{colors.gray.950}" },
      },
      subtle: {
        value: {
          base: "{colors.gray.100}",
          _dark: "{colors.gray.900}",
        },
      },
      muted: {
        value: {
          base: "{colors.gray.200}",
          _dark: "{colors.gray.800}",
        },
      },
      emphasized: {
        value: {
          base: "{colors.gray.300}",
          _dark: "{colors.gray.600}",
        },
      },
      disabled: {
        value: {
          base: "{colors.gray.200}",
          _dark: "{colors.gray.700}",
        },
      },
    },
    fg: {
      default: {
        value: { base: "{colors.gray.950}", _dark: "{colors.white}" },
      },
      emphasized: {
        value: {
          base: "{colors.gray.700}",
          _dark: "{colors.gray.200}",
        },
      },
      muted: {
        value: {
          base: "{colors.gray.600}",
          _dark: "{colors.gray.300}",
        },
      },
      subtle: {
        value: {
          base: "{colors.gray.500}",
          _dark: "{colors.gray.400}",
        },
      },
      disabled: {
        value: {
          base: "{colors.gray.300}",
          _dark: "{colors.gray.700}",
        },
      },
    },
    accent: {
      default: {
        value: {
          base: "{colors.tailor-blue.600}",
          _dark: "{colors.tailor-blue.600}",
        },
      },
      emphasized: {
        value: {
          base: "{colors.tailor-blue.700}",
          _dark: "{colors.tailor-blue.500}",
        },
      },
      fg: {
        value: {
          base: "{colors.tailor-blue.600}",
          _dark: "{colors.tailor-blue.600}",
        },
      },
    },

    border: {
      default: {
        value: {
          base: "{colors.gray.200}",
          _dark: "{colors.gray.800}",
        },
      },
      emphasized: {
        value: {
          base: "{colors.gray.300}",
          _dark: "{colors.gray.700}",
        },
      },
      outline: {
        value: {
          base: "{colors.gray.600}",
          _dark: "{colors.gray.400}",
        },
      },
      accent: {
        value: "{colors.accent.default}",
      },
      disabled: {
        value: {
          base: "{colors.gray.200}",
          _dark: "{colors.gray.800}",
        },
      },
    },
    status: {
      success: {
        default: {
          value: {
            base: "{colors.green.500}",
          },
        },
        muted: {
          value: {
            base: "{colors.green.300}",
          },
        },
      },
      alert: {
        default: {
          value: {
            base: "{colors.yellow.500}",
          },
        },
        muted: {
          value: {
            base: "{colors.yellow.300}",
          },
        },
      },
      error: {
        default: {
          value: {
            base: "{colors.red.500}",
          },
        },
        muted: {
          value: {
            base: "{colors.red.300}",
          },
        },
      },
    },
  },
  shadows: {
    accent: {
      value: "0 0 0 1px {colors.border.accent}",
    },
    outline: {
      value: "0 0 0 1px {colors.border.outline}",
    },
    xs: {
      value: {
        base: "0px 1px 2px rgba(23, 23, 23,  0.1)",
        _dark: "0px 1px 2px rgba(0, 0, 0, 1.0)",
      },
    },
    sm: {
      value: {
        base: "0px 2px 4px rgba(23, 23, 23,  0.1)",
        _dark: "0px 2px 4px rgba(0, 0, 0, 1.0)",
      },
    },
    md: {
      value: {
        base: "0px 4px 8px rgba(23, 23, 23,  0.1)",
        _dark: "0px 4px 8px rgba(0, 0, 0, 1.0)",
      },
    },
    lg: {
      value: {
        base: "0px 8px 16px rgba(23, 23, 23,  0.1)",
        _dark: "0px 8px 16px rgba(0, 0, 0, 1.0)",
      },
    },
    xl: {
      value: {
        base: "0px 16px 24px rgba(23, 23, 23,  0.1)",
        _dark: "0px 16px 24px rgba(0, 0, 0, 1.0)",
      },
    },
  },
  radii: {
    l1: { value: "{radii.xs}" },
    l2: { value: "{radii.sm}" },
    l3: { value: "{radii.md}" },
  },
});
