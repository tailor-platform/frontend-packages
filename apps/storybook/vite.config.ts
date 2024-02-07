import panda from "@pandacss/dev/postcss";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import * as path from "path";

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        panda({
          configPath: path.resolve(
            __dirname,
            "./../../packages/design-systems/panda.config.ts",
          ),
        }),
      ],
    },
  },
  resolve: {
    alias: {
      "@tailor-platform/styled-system": path.resolve(
        __dirname,
        "./../../packages/design-systems/node_modules/@tailor-platform/styled-system",
      ),
      "@tailor-platform/design-systems/client": path.resolve(
        __dirname,
        "./../../packages/design-systems/dist/client.mjs",
      ),
    },
  },
  plugins: [react()],
});
