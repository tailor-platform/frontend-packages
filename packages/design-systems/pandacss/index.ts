import { defineConfig, type Config } from "@pandacss/dev";
import { deepmerge } from "deepmerge-ts";
import { globalCss } from "../src/theme/global-css";
import { conditions } from "../src/theme/conditions";
import { recipes } from "../src/theme/recipes";
import { semanticTokens } from "../src/theme/semantic-tokens";
import { slotRecipes } from "../src/theme/slot-recipes";
import { textStyles } from "../src/theme/text-styles";
import { tokens } from "../src/theme/tokens";

export const buildPandaConfig = (config: Config): Config => {
  const mergedConfig: Config = deepmerge(defaultPandaConfig, config);

  return defineConfig({
    ...mergedConfig,
  });
};

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
