import { defineConfig } from "@pandacss/dev";

import {
  conditions,
  globalCss,
  recipes,
  semanticTokens,
  slotRecipes,
  textStyles,
  tokens,
} from "@tailor-platform/design-systems/client";

export default defineConfig({
  preflight: true,
  include: [
    "./src/stories/**/*.{js,jsx,ts,tsx}",
    "./../../packages/design-systems/src/**/*.{js,jsx,ts,tsx}",
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
});
