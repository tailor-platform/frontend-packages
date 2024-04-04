import { defineConfig } from "@pandacss/dev";
import { globalCss } from "./src/pandacss/theme/global-css";
import { conditions } from "./src/pandacss/theme/conditions";
import { recipes } from "./src/pandacss/theme/recipes";
import { semanticTokens } from "./src/pandacss/theme/semantic-tokens";
import { slotRecipes } from "./src/pandacss/theme/slot-recipes";
import { textStyles } from "./src/pandacss/theme/text-styles";
import { tokens } from "./src/pandacss/theme/tokens";

export default defineConfig({
  emitPackage: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  jsxFramework: "react",
  outdir: "@tailor-platform/styled-system",
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
