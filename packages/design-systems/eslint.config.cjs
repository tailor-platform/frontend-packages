// ts-check
const tsEslint = require("typescript-eslint");
const devConfig = require("@tailor-platform/dev-config/eslint");

module.exports = tsEslint.config(
  {
    ignores: ["postcss.config.js"],
  },
  ...devConfig,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      // If we modify it according to the following two rules, error will occur when running the test.
      "@typescript-eslint/require-await": "off",
      "testing-library/no-unnecessary-act": "off",
    },
  },
);
