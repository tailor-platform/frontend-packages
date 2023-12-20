const devConfig = require("@tailor-platform/dev-config/eslint");

module.exports = {
  ...devConfig,
  root: true,
  /*
    TODO: Start using more stricter rules from above parent @tailor-platform/dev-config/eslint and then remove the below overrides.
    Rules from the previous eslint-config-custom package are kept as it is for now (in the form of below overrides).
  */
  rules: {
    ...devConfig.rules,
    "@next/next/no-html-link-for-pages": "off",
  },
};
