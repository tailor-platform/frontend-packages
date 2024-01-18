#!/usr/bin/env node
import { runCLI } from "./cli.js";
import { terminal } from "./support/logger.js";

runCLI(process.argv).catch((e) => {
  terminal.error("app", e instanceof Error ? e.message : e);
});
