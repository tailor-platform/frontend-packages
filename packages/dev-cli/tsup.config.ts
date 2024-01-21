import { defineConfig } from "tsup";
import { commands } from "./src/cli/commands";

const devOpts =
  process.env.NODE_ENV === "development"
    ? {
        minify: false,
        splitting: false,
        sourcemap: true,
        clean: true,
      }
    : {};

// build entries for builtin scripts (equals to mapping `builtin/*` compiled from `src/builtin/*.ts`)
const builtinScriptEntries = Object.keys(commands).reduce((acc, current) => {
  const path = commands[current].path;
  return Object.assign(acc, {
    [path]: `src/${path}.ts`,
  });
}, {});

export default defineConfig({
  entry: {
    cli: "src/cli/index.ts",
    script: "src/script/index.ts",
    ...builtinScriptEntries,
  },
  minify: true,
  format: ["esm"],
  dts: true,
  ...devOpts,
});
