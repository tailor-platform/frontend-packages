import { createRequire } from "node:module";
import { LevelledLogger } from "./logger.js";

export const runBuiltinCommands = async (args: readonly string[]) => {
  const { Command } = await import("@commander-js/extra-typings");
  const program = new Command();

  program.configureHelp({
    sortSubcommands: true,
    sortOptions: true,
  });

  const require = createRequire(import.meta.url);
  const { version, description } = require("../package.json") as {
    version: string;
    description: string;
  };
  program
    .name("minitailorctl")
    .description(description)
    .option("--verbose", "enable verbosity", false)
    .version(version)
    .hook("preAction", (options) => {
      const opts = options.opts();
      if (opts.verbose) {
        logger.setLevel("debug");
        logger.debug("CLI", "enabled verbose mode");
      }
    });

  app.parse(args);
};
