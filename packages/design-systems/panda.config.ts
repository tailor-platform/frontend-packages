import { defineConfig } from "@pandacss/dev";
import { recipes } from "./src/theme/recipes";
import { semanticTokens } from "./src/theme/semantic-tokens";
import { slotRecipes } from "./src/theme/slot-recipes";
import { textStyles } from "./src/theme/text-styles";
import { tokens } from "./src/theme/tokens";
import { globalCss } from "./src/theme/global-css";
import { conditions } from "./src/theme/conditions";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./dist/panda.buildinfo.json"],
  exclude: [],
  jsxFramework: "react",
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
  globalCss,
  emitPackage: true,
  importMap: "@tailor-platform/styled-system",
  outdir: "@tailor-platform/styled-system",
  logLevel: "info",
});
