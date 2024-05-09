/// <reference types="node" />
import { Options, defineConfig } from "tsup";

const devOpts: Options =
  process.env.NODE_ENV === "development"
    ? {
        minify: false,
        splitting: false,
        sourcemap: true,
      }
    : {};

const commonOpts: Options = {
  format: ["cjs", "esm"],
  external: ["react", "react-dom"],
  dts: true,
  clean: true,
  ...devOpts,
};

export default defineConfig([
  {
    entry: {
      index: "src/index.tsx",
      "pandacss/index": "./src/pandacss/index.ts",
      "locales/index": "src/locales/index.ts",
      "locales/ja": "src/locales/ja.ts",
      "locales/en": "src/locales/en.ts",
    },
    ...commonOpts,
  },
  {
    banner: {
      js: `"use client"`,
    },
    entry: {
      client: "src/client.tsx",
    },
    ...commonOpts,
  },
]);
