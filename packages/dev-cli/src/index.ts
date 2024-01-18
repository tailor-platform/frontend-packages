#!/usr/bin/env node
import { runCLI } from "./cli.js";
import { logger } from "./support/logger.js";

runCLI(process.argv).catch((e) => {
  logger.error("app", e instanceof Error ? e.message : e);
});
