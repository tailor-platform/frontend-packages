import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  include: [
    "../**/*.{ts,tsx}",
    "../../../node_modules/@tailor-platform/src/**/*/tsx",
  ],
});
