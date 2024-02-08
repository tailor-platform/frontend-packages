import { defineConfig } from "@pandacss/dev";

import { buildPandaConfig } from "./node_modules/@tailor-platform/dev-config/pandacss";

export default buildPandaConfig(
  defineConfig({
    include: [
      "./src/stories/**/*.{js,jsx,ts,tsx}",
      "./../../packages/design-systems/src/**/*.{js,jsx,ts,tsx}",
    ],
  }),
);
