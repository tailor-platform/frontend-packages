import panda from "@pandacss/dev/postcss";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import * as path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        panda({
          configPath: path.resolve(__dirname, "./panda.config.ts"),
        }),
      ],
    },
  },
  resolve: {
    alias: [
      {
        find: "@tailor-platform/styled-system/*",
        replacement: path.resolve(
          __dirname,
          "./node_modules/@tailor-platform/styled-system/*",
        ),
      },
      {
        find: "@tailor-platform/design-systems/client",
        replacement: path.resolve(
          __dirname,
          "./../../packages/design-systems/dist/client.mjs",
        ),
      },
      {
        find: "@tailor-platform/dev-config/pandacss",
        replacement: path.resolve(
          __dirname,
          "./node_modules/@tailor-platform/dev-config/pandacss",
        ),
      },
    ],
  },
  plugins: [react(), tsconfigPaths()],
});
