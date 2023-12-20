module.exports = {
  ...require("@tailor-platform/dev-config/eslint"),
  root: true,
  /*
    TODO: Start using more stricter rules from above parent @tailor-platform/dev-config/eslint and then remove the below overrides.
    Rules from the previous eslint-config-custom package are kept as it is for now (in the form of below overrides).
  */
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-useless-escape": "warn",
    "no-empty": "warn",
    "no-irregular-whitespace": "warn",
  },
  extends: [
    "next",
    "turbo",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vitest/recommended",
    "plugin:vitest-globals/recommended",
    "prettier",
  ],
};
