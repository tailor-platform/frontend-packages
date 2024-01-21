import { defineConfig } from "tsup";

const devOpts =
  process.env.NODE_ENV === "development"
    ? {
        minify: false,
        splitting: false,
        sourcemap: true,
        clean: true,
      }
    : {};

export default defineConfig({
  entry: {
    cli: "src/cli/index.ts",
    script: "src/script/index.ts",

    // builtin scripts
    "builtin/start": "src/builtin/start.ts",
    "builtin/reset": "src/builtin/reset.ts",
    "builtin/apply": "src/builtin/apply.ts",
    "builtin/install-deps": "src/builtin/install-deps.ts",
    "builtin/uninstall-deps": "src/builtin/uninstall-deps.ts",
  },
  minify: true,
  format: "esm",
  dts: true,
  ...devOpts,
});
