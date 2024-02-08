import { defineConfig } from "@pandacss/dev";

import { recipes } from "./src/theme/recipes";
import { semanticTokens } from "./src/theme/semantic-tokens";
import { slotRecipes } from "./src/theme/slot-recipes";
import { textStyles } from "./src/theme/text-styles";
import { tokens } from "./src/theme/tokens";

export default defineConfig({
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      recipes,
      semanticTokens,
      slotRecipes,
      textStyles,
      tokens,
    },
  },
});
