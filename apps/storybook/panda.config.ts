import { defineConfig } from "@pandacss/dev";
import { buildPandaConfig } from "@tailor-platform/dev-config/pandacss";

export default buildPandaConfig(
  defineConfig({
    include: [
      "./src/stories/**/*.{js,jsx,ts,tsx}",
      "./../../packages/design-systems/src/**/*.{js,jsx,ts,tsx}",
      "./../../packages/datagrid/src/**/*.{js,jsx,ts,tsx}",
      "./node_modules/@tailor-platform/datagrid/dist/panda.buildinfo.json",
      "./node_modules/@tailor-platform/design-systems/dist/panda.buildinfo.json",
    ],
  }),
);
