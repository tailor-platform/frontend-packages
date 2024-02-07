import { defineConfig } from "@pandacss/dev";

import {
  conditions,
  globalCss,
  recipes,
  semanticTokens,
  slotRecipes,
  textStyles,
  tokens,
} from "../../design-systems/dist/client";

export function buildPandaConfig(config) {
  const designSysetemConfig = {
    preflight: true,
    include: [
      "./src/stories/**/*.{js,jsx,ts,tsx}",
      "./../../packages/design-systems/src/**/*.{js,jsx,ts,tsx}",
      "./node_modules/@tailor-platform/datagrid/dist/panda.buildinfo.json",
      "./node_modules/@tailor-platform/design-systems/dist/panda.buildinfo.json",
    ],
    exclude: [],
    jsxFramework: "react",
    theme: {
      recipes,
      slotRecipes,
      semanticTokens,
      textStyles,
      tokens,
    },
    conditions,
    globalCss,
    emitPackage: true,
    outdir: "@tailor-platform/styled-system",
    importMap: "@tailor-platform/styled-system",
  };

  return defineConfig({
    ...designSysetemConfig,
    ...config,
  });
}

export const defaultPandaConfig = defineConfig({
  preflight: true,
  include: [
    "./src/stories/**/*.{js,jsx,ts,tsx}",
    "./../../packages/design-systems/src/**/*.{js,jsx,ts,tsx}",
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
