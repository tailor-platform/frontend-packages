import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    cli: "src/cli/index.ts",
    script: "src/script/index.ts",

    // builtin scripts
    "builtin/start": "src/builtin/start.ts",
    "builtin/reset": "src/builtin/reset.ts",
    "builtin/apply": "src/builtin/apply.ts",
  },
  format: "esm",
  minify: true,
  dts: true,
});
