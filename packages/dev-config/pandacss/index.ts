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
  return defineConfig({
    ...defaultPandaConfig,
    ...config,
    theme: {
      extend: {
        ...defaultPandaConfig.theme.extend,
        ...config.theme.extend,
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
