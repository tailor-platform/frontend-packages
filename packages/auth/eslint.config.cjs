const globals = require("globals");
const tsEslint = require("typescript-eslint");
const devConfig = require("@tailor-platform/dev-config/eslint");

module.exports = tsEslint.config(...devConfig, {
  languageOptions: {
    globals: {
      ...globals.browser,
      screen: "off",
      process: "readonly",
      global: "readonly",
      React: "readonly",
    },
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
});
