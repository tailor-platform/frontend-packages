#!/usr/bin/env node
import process from "node:process";
import { runTailorctl } from "./tailorctl.js";
import { runBuiltinCommands } from "./commands.js";

const runCLI = async (argv: readonly string[]) => {
  // Run tailorctl proxy mode if splitter ("--") is specified before arguments
  const proxyArgv = argv.slice(2);
  if (proxyArgv.length > 0 && proxyArgv[0] === "--") {
    return await runTailorctl(proxyArgv.slice(1));
  }

  // Run builtin commands otherwise
  await runBuiltinCommands(argv);
};

await runCLI(process.argv);
