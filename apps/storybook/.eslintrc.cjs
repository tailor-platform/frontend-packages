module.exports = {
  ...require("@tailor-platform/dev-config/eslint"),
  root: true,
  /*
    TODO: Start using more stricter rules from above parent @tailor-platform/dev-config/eslint and then remove the below overrides.
    Previous rules are kept as it is for now (in the form of below overrides).
  */
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: undefined
  },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      {
        allowConstantExport: true,
      },
    ],
  },
};
