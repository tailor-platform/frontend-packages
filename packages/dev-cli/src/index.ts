#!/usr/bin/env node
import { runCLI } from "./cli/index.js";
import { terminal } from "./cli/support/logger.js";

runCLI(process.argv).catch((e) => {
  terminal.error("app", e instanceof Error ? e.message : e);
});
