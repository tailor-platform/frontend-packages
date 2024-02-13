import { defineConfig, type Config } from "@pandacss/dev";

import {
  conditions,
  globalCss,
  recipes,
  semanticTokens,
  slotRecipes,
  textStyles,
  tokens,
} from "@tailor-platform/design-systems/client";

export function buildPandaConfig(config: Config): Config {
  const { theme: defaultTheme, ...defaultRest } = defaultPandaConfig;
  const {
    recipes: defaultRecipes,
    slotRecipes: defaultSlotRecipes,
    semanticTokens: defaultSemanticTokens,
    textStyles: defaultTextStyles,
    tokens: defaultTokens,
  } = defaultTheme.extend;
  const { theme, ...rest } = config;

  return defineConfig({
    ...defaultRest,
    ...rest,
    theme: {
      extend: {
        ...theme?.extend,
        recipes: {
          ...defaultRecipes,
          ...theme?.extend.recipes,
        },
        slotRecipes: {
          ...defaultSlotRecipes,
          ...theme?.extend.slotRecipes,
        },
        semanticTokens: {
          ...defaultSemanticTokens,
          ...theme?.extend.semanticTokens,
        },
        textStyles: {
          ...defaultTextStyles,
          ...theme?.extend.textStyles,
        },
        tokens: {
          ...defaultTokens,
          ...theme?.extend.tokens,
        },
      },
    },
  });
}

export const defaultPandaConfig = defineConfig({
  preflight: true,
  include: [],
  exclude: [],
  jsxFramework: "react",
  theme: {
    extend: {
      recipes,
      slotRecipes,
      semanticTokens,
      textStyles,
      tokens,
    },
  },
  conditions,
  globalCss,
  emitPackage: true,
  outdir: "@tailor-platform/styled-system",
  importMap: "@tailor-platform/styled-system",
});
