const tsEslint = require("typescript-eslint");
const devConfig = require("@tailor-platform/dev-config/eslint");

module.exports = tsEslint.config(...devConfig, {
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
});
