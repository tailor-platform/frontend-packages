import { defineConfig, type Config } from "@pandacss/dev";

import {
  conditions,
  globalCss,
  recipes,
  semanticTokens,
  slotRecipes,
  textStyles,
  tokens,
} from "../../design-systems/dist/client";

export function buildPandaConfig(config: Config): Config {
  return defineConfig({
    ...defaultPandaConfig,
    ...config,
  });
}

export const defaultPandaConfig = defineConfig({
  preflight: true,
  include: [
    "./node_modules/@tailor-platform/datagrid/dist/panda.buildinfo.json",
    "./node_modules/@tailor-platform/design-systems/dist/panda.buildinfo.json",
  ],
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
