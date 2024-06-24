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
  entry: ["src"],
  clean: true,
  minify: true,
  dts: true,
  external: ["@apollo/client"],
  ...devOpts,
});
