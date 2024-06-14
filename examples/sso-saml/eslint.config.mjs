// ts-check
import tsEslint from "typescript-eslint";
import { fixupPluginRules } from "@eslint/compat";
import next from "@next/eslint-plugin-next";

export default tsEslint.config({
  files: ["**/*.{ts,tsx}"],
  languageOptions: { parser: tsEslint.parser },
  plugins: {
    // https://github.com/vercel/next.js/issues/58411
    "@next/next": fixupPluginRules(next),
  },
  rules: {
    ...next.configs["core-web-vitals"].rules,
  },
});
