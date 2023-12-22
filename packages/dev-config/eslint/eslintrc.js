module.exports = {
  extends: [
    "next",
    "turbo",
    "eslint:recommended",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:vitest/recommended",
    "plugin:vitest-globals/recommended",
    "plugin:testing-library/react",
    // TODO: Use "plugin:@typescript-eslint/recommended-type-checked" once sdh-client is ready
    "plugin:@typescript-eslint/recommended-type-checked",
  ],
  ignorePatterns: [
    ".eslintrc.js",
    "package.json",
    "tsconfig.json",
    "tsconfig.tsbuildinfo",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: [
    "@typescript-eslint",
    "testing-library",
    "todo-comment",
    "prefer-arrow-functions",
    "vitest",
  ],
  rules: {
    "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": [
      "error",
      {
        // Always use unknown instead of any
        fixToUnknown: true,
      },
    ],
    "@typescript-eslint/no-misused-promises": [
      "warn",
      {
        // Disables void-return check for Promise raises annoying warnings
        // in the common case like passing async function to DOM event handlers (eg. onClick)
        checksVoidReturn: false,
      },
    ],
    "@typescript-eslint/no-floating-promises": [
      "warn",
      {
        // Resolving Promise with `void` is not preferable
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
    "@typescript-eslint/no-unused-vars": [
      "error",
      { ignoreRestSiblings: true },
    ],
    "@typescript-eslint/ban-ts-comment": "off",
    "no-useless-escape": "error",
    "no-empty": "error",
    "no-var": "error",
    "no-console": "error",
    "react-hooks/exhaustive-deps": "error",
    "import/order": ["error", { "newlines-between": "never" }],
    "import/newline-after-import": "error",
    "import/first": "error",
    "prefer-arrow-functions/prefer-arrow-functions": "warn",
    "todo-comment/ticket-url": "error",
  },
};
