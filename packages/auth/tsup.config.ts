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
  entry: ["src/client/index.ts", "src/server/index.ts", "src/core/index.ts"],
  clean: true,
  minify: true,
  dts: true,
  external: ["react"],
  ...devOpts,
});
