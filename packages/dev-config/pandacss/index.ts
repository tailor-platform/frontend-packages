import {
  defineConfig,
  type Config,
} from "@pandacss/dev";
import { deepmerge } from "deepmerge-ts";
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
  const mergedConfig: Config = deepmerge(defaultPandaConfig,config)

  return defineConfig({
    ...mergedConfig
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
