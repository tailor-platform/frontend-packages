import typescriptEslint from "@typescript-eslint/eslint-plugin";
import testingLibrary from "eslint-plugin-testing-library";
import todoComment from "eslint-plugin-todo-comment";
import preferArrowFunctions from "eslint-plugin-prefer-arrow-functions";
import vitest from "eslint-plugin-vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/.eslintrc.js",
      "**/package.json",
      "**/tsconfig.json",
      "**/tsconfig.tsbuildinfo",
    ],
  },
  ...compat.extends(
    "next",
    "turbo",
    "eslint:recommended",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:vitest/recommended",
    "plugin:vitest-globals/recommended",
    "plugin:testing-library/react",
    "plugin:@typescript-eslint/recommended-type-checked"
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "testing-library": testingLibrary,
      "todo-comment": todoComment,
      "prefer-arrow-functions": preferArrowFunctions,
      vitest,
    },

    languageOptions: {
      parser: typescriptEslint.parser,
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        project: true,
      },
    },

    rules: {
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
  },
];
