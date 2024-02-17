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
  entry: ["src/client/index.ts", "src/server/index.ts", "src/adapters/apollo"],
  clean: true,
  minify: true,
  format: ["cjs", "esm"],
  dts: true,
  external: ["react", "@apollo/client"],
  ...devOpts,
});
