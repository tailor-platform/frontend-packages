import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@lib": resolve(__dirname, "./src/lib"),
      "@provider": resolve(__dirname, "./src/provider"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
