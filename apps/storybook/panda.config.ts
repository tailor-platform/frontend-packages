import { defineConfig } from "@pandacss/dev";
import { buildPandaConfig } from "../../packages/design-systems/src/pandacss";

export default buildPandaConfig(
  defineConfig({
    theme: {
      extend: {
        recipes: {
          density: {
            variants: {
              size: {
                sm: {
                  paddingTop: "4px",
                  paddingBottom: "4px",
                },
                md: {
                  paddingTop: "8px",
                  paddingBottom: "8px",
                },
                lg: {
                  paddingTop: "12px",
                  paddingBottom: "12px",
                },
              },
            },
          },
        },
      },
    },
    include: [
      "./src/stories/**/*.{js,jsx,ts,tsx}",
      "./node_modules/@tailor-platform/design-systems/dist/panda.buildinfo.json",
    ],
  }),
);
