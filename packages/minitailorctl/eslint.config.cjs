// ts-check
const tsEslint = require("typescript-eslint");
const devConfig = require("@tailor-platform/dev-config/eslint");

module.exports = tsEslint.config(
  {
    ignores: ["tsup.config.ts"],
  },
  ...devConfig,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",

      // This rule warns debug method in logger class so disabled
      "testing-library/no-debugging-utils": "off",
    },
  },
);
