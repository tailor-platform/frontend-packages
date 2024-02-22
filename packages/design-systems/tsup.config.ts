import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.tsx",
    client: "src/client.tsx",
    "pandacss/index": "./src/pandacss/index.ts",
    "locales/index": "src/locales/index.ts",
    "locales/ja": "src/locales/ja.ts",
    "locales/en": "src/locales/en.ts",
    // "locales/*": "src/locales/*"
  },
  format: ["cjs", "esm"],
  external: ["react"],
  dts: true,
  clean: true,
  sourcemap: true,
});
