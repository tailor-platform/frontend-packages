// ts-check

import globals from "globals";
import * as tsEslint from "typescript-eslint";
import { fixupPluginRules } from "@eslint/compat";
import devConfig from "@tailor-platform/dev-config/eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import storybook from "eslint-plugin-storybook";

export default tsEslint.config(
  ...devConfig,
  {
    ignores: [
      "dist",
      ".storybook",
      "postcss.config.js",
      "eslint.config.mjs",
      "panda.config.ts",
      "vite.config.ts",
      "*.d.ts",
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
    },
    plugins: {
      "react-refresh": reactRefresh,
      "react-hooks": reactHooks,
      storybook: fixupPluginRules(storybook), // https://github.com/storybookjs/eslint-plugin-storybook/issues/135
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...storybook.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
    },
  },
  {
    files: ["scripts/**/*.ts"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/require-await": "off",
    },
  },
);
