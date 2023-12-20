const devConfig = require("@tailor-platform/dev-config/eslint");

module.exports = {
  ...devConfig,
  root: true,
  rules: {
    ...devConfig.rules,
    "@next/next/no-html-link-for-pages": "off",
  },
};
