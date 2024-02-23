#!/usr/bin/env node
import process from "node:process";
import { extractProxyCommand, runTailorctl } from "./tailorctl.js";
import { getBuiltinCommands } from "./commands.js";

const runCLI = async (argv: readonly string[]) => {
  const proxyCommands = extractProxyCommand(argv);
  if (proxyCommands !== undefined) {
    return await runTailorctl(proxyCommands);
  }

  const builtin = await getBuiltinCommands();
  builtin.parse(argv);
};

await runCLI(process.argv);
