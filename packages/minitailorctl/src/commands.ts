import { createRequire } from "node:module";
import { LevelledLogger } from "./logger.js";
import { generateCommand } from "./commands/generate.js";

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
  const logger = new LevelledLogger();
  const app = program
    .name("tailordev")
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

  app
    .command("generate")
    .description("Generate files to run minitailor")
    .action(() => generateCommand(logger));

  app.parse(args);
};
