// ts-check
const eslint = require("@eslint/js");
const tsEslint = require("typescript-eslint");
const prettier = require("eslint-config-prettier");
const turbo = require("eslint-plugin-turbo");
const testingLibrary = require("eslint-plugin-testing-library");
const next = require("@next/eslint-plugin-next");
const reactHooks = require("eslint-plugin-react-hooks");
const todoComment = require("eslint-plugin-todo-comment");
const preferArrowFunctions = require("eslint-plugin-prefer-arrow-functions");
const vitest = require("eslint-plugin-vitest");
const importPlugin = require("eslint-plugin-import");
const { fixupPluginRules, fixupConfigRules } = require("@eslint/compat");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
});
const config = tsEslint.config(
  {
    ignores: [
      "**/eslint.config.cjs",
      "**/package.json",
      "**/tsconfig.json",
      "**/tsconfig.tsbuildinfo",
    ],
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  prettier,
  {
    plugins: {
      // https://github.com/vercel/turbo/issues/7909
      turbo,
      // https://github.com/import-js/eslint-plugin-import/issues/2556
      import: fixupPluginRules(importPlugin),
      "todo-comment": todoComment,
      "prefer-arrow-functions": fixupPluginRules(preferArrowFunctions),
      // https://github.com/vercel/next.js/issues/58411
      "@next/next": fixupPluginRules(next),
      "react-hooks": reactHooks,
      vitest,
      // // https://github.com/testing-library/eslint-plugin-testing-library/issues/853
      "testing-library": fixupPluginRules(testingLibrary),
    },
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        project: true,
      },
      ecmaVersion: 5,
      sourceType: "script",
    },
    rules: {
      ...turbo.configs.recommended.rules,
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
      ...vitest.configs.recommended.rules,
      ...testingLibrary.configs.react.rules,
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": [
        "error",
        {
          fixToUnknown: true,
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        "warn",
        {
          checksVoidReturn: false,
        },
      ],
      "@typescript-eslint/no-floating-promises": [
        "warn",
        {
          ignoreVoid: false,
        },
      ],
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "variable",
          modifiers: ["const"],
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
      ],
      "@typescript-eslint/ban-ts-comment": "off",
      "no-useless-escape": "error",
      "no-empty": "error",
      "no-var": "error",
      "no-console": "error",
      "react-hooks/exhaustive-deps": "error",
      "import/order": [
        "error",
        {
          "newlines-between": "never",
        },
      ],

      "import/newline-after-import": "error",
      "import/first": "error",
      "prefer-arrow-functions/prefer-arrow-functions": "warn",
      "todo-comment/ticket-url": "error",
    },
  }
);
module.exports = config;
