import { defineConfig } from "@pandacss/dev";
import { globalCss } from "../design-systems/src/theme/global-css";
import { conditions } from "../design-systems/src/theme/conditions";
import { recipes } from "./src/theme/recipes";
import { semanticTokens } from "./src/theme/semantic-tokens";
import { slotRecipes } from "./src/theme/slot-recipes";
import { textStyles } from "./src/theme/text-styles";
import { tokens } from "./src/theme/tokens";

export default defineConfig({
  emitPackage: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  jsxFramework: "react",
  outdir: "../../../node_modules/@tailor-platform/styled-system",
  preflight: true,
  theme: {
    extend: {
      recipes,
      semanticTokens,
      slotRecipes,
      textStyles,
      tokens,
    },
  },
  conditions,
  globalCss: { extend: globalCss },
});
