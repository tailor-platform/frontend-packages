import { defineConfig } from "@pandacss/dev";

import { buildPandaConfig } from "@tailor-platform/dev-config/pandacss";

export default buildPandaConfig(
  defineConfig({
    include: [
      "./src/stories/**/*.{js,jsx,ts,tsx}",
      "./../../packages/design-systems/src/**/*.{js,jsx,ts,tsx}",
    ],
  }),
);
