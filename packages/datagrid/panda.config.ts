import { defineConfig } from "@pandacss/dev";

import { recipes } from "../design-systems/src/theme/recipes";
import { semanticTokens } from "../design-systems/src/theme/semantic-tokens";
import { slotRecipes } from "../design-systems/src/theme/slot-recipes";
import { textStyles } from "../design-systems/src/theme/text-styles";
import { tokens } from "../design-systems/src/theme/tokens";
import { globalCss } from "../design-systems/src/theme/global-css";
import { conditions } from "../design-systems/src/theme/conditions";

export default defineConfig({
  emitPackage: true,
  exclude: [],
  include: [
    "../**/*.{ts,tsx}",
    "../../../node_modules/@tailor-platform/src/**/*/tsx",
    './node_modules/@tailor-platform/design-systems/dist/panda.buildinfo.json',
  ],
  jsxFramework: "react",
  outdir: "../../../node_modules/@tailor-platform/styled-system",
  preflight: true,
  theme: {
    recipes,
    semanticTokens,
    slotRecipes,
    textStyles,
    tokens,
  },
  conditions,
  globalCss,
  importMap: "@tailor-platform/styled-system"
});
