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
  entry: {
    react: "src/react/index.ts",
  },
  clean: true,
  minify: true,
  format: ["esm"],
  dts: true,
  ...devOpts,
});
