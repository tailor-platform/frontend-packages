/**
 * PandaCSS configuration object
 *
 * @packageDocumentation
 */
import { defineConfig, type Config } from "@pandacss/dev";
import { deepmerge } from "deepmerge-ts";
import { globalCss } from "./theme/global-css";
import {
  conditions,
  recipes,
  slotRecipes,
  semanticTokens,
  textStyles,
  tokens,
} from "./theme";

/**
 * Build the PandaCSS configuration object
 *
 * @category Builder
 * @example
 * ```
 * import { defineConfig } from "@pandacss/dev";
 * import { buildPandaConfig } from "@tailor-platform/design-systems/pandacss";
 *
 * export default buildPandaConfig(
 *  defineConfig({
 *    include: [
 *      "./src/**\/*.{js,jsx,ts,tsx}",
 *      "./pages/**\/*.{js,jsx,ts,tsx}",
 *      "./node_modules/@tailor-platform/design-systems/dist/panda.buildinfo.json",
 *    ],
 *    exclude: [],
 *    theme: {
 *      extend: {
 *        // Add your custom theme tokens here
 *      },
 *    },
 * })
 * ```
 */
export const buildPandaConfig = (config: Config): Config => {
  const mergedConfig: Config = deepmerge(defaultPandaConfig, config);

  return defineConfig({
    ...mergedConfig,
  });
};

const defaultPandaConfig = defineConfig({
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
