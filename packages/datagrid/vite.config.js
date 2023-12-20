import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    testTimeout: process.env.CI ? 10000 : 5000, //Default is 5000ms
  },
});
