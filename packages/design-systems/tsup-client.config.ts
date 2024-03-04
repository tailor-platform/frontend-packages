import { defineConfig } from "tsup";

export default defineConfig({
  banner: {
    js: `"use client"`,
  },
  entry: {
    client: "src/client.tsx",
  },
  format: ["cjs", "esm"],
  external: ["react"],
  dts: true,
  clean: true,
  sourcemap: true,
});
