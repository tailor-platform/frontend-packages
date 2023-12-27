#!/usr/bin/env node
import { runCLI } from "./cli.js";

runCLI(process.argv).catch((e) => {
  console.error(e);
});
