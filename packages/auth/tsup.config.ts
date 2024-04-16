/// <reference types="node" />
import { defineConfig } from "tsup";

const devOpts =
  process.env.NODE_ENV === "development"
    ? {
        minify: false,
        splitting: false,
        sourcemap: true,
      }
    : {};

export default defineConfig({
  // explictly use CommonJS as build format here
  // because auth package depends on @apollo/client that has no ESM support
  format: ["cjs"],
  entry: [
    "src/client/index.ts",
    "src/server/index.ts",
    "src/core/index.ts",
    "src/adapters/apollo",
  ],
  clean: true,
  minify: true,
  dts: true,
  external: ["react", "@apollo/client"],
  ...devOpts,
});
