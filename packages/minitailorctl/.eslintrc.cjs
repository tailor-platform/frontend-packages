const devConfig = require("@tailor-platform/dev-config/eslint");

module.exports = {
  ...devConfig,
  ignorePatterns: [...devConfig.ignorePatterns, "tsup.config.ts", "*.cjs"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  rules: {
    ...devConfig.rules,
    "@next/next/no-html-link-for-pages": "off",

    // This rule warns debug method in logger class so disabled
    "testing-library/no-debugging-utils": "off",
  },
};
