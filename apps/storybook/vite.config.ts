import panda from "@pandacss/dev/postcss";
import { defineConfig } from "vite";
import * as path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Enabling react plugin prevents us from running storybook on dev, but required on Chromatic build,
  // So we put our own temporary environment variable (_STORYBOOK_DEV) to tell if it's dev or not to switch plugins.
  plugins: process.env._STORYBOOK_DEV ? [] : [react()],
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
        find: "@tailor-platform/design-systems/*",
        replacement: path.resolve(
          __dirname,
          "./node_modules/design-systems/dist/*",
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
        find: "@tailor-platform/design-systems/locales",
        replacement: path.resolve(
          __dirname,
          "./node_modules/@tailor-platform/design-systems/dist/locales",
        ),
      },
      {
        find: "@tailor-platform/design-systems/pandacss",
        replacement: path.resolve(
          __dirname,
          "./node_modules/@tailor-platform/design-systems/dist/pandacss",
        ),
      },
    ],
  },
});
