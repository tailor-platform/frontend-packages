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
  format: ["esm"],
  entry: ["src/core/index.ts", "src/resources/index.ts"],
  clean: true,
  minify: true,
  dts: true,
  external: ["react"],
  ...devOpts,
});
