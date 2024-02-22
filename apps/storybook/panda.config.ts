import { defineConfig } from "@pandacss/dev";
import { buildPandaConfig } from "@tailor-platform/design-systems/pandacss";
// import { buildPandaConfig } from "../../packages/design-systems/src/pandacss";

export default buildPandaConfig(
  defineConfig({
    include: [
      "./src/stories/**/*.{js,jsx,ts,tsx}",
      "./node_modules/@tailor-platform/design-systems/dist/panda.buildinfo.json",
    ],
    importMap: "@tailor-platform/design-systems",
    outdir: "@tailor-platform/styled-system",
  }),
);
