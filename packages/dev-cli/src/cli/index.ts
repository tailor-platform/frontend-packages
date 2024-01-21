import { execaNode } from "execa";
import path from "path";
import { Option, Command } from "@commander-js/extra-typings";
import * as changeCase from "change-case";
import { commands } from "./commands.js";
import { LevelledLogger, LogLevel } from "./logger.js";
import { getConfig } from "./config.js";

const baseEnv = {
  // Environment variables needed to bypass platform authorization on minitailor
  APP_HTTP_SCHEMA: "http",
  PLATFORM_URL: "http://mini.tailor.tech:18090",
  TAILOR_TOKEN: "tpp_11111111111111111111111111111111",
};

const registerBuiltinCommands = (app: Command, logLevel: LogLevel) => {
  const resolveScript = (filename: string) => {
    const pathWithProtocol = new URL(import.meta.url);
    return path.join(pathWithProtocol.pathname, `../${filename}.js`);
  };

  // see `src/cli/commands.ts` for commands to be registered
  Object.keys(commands).forEach((key) => {
    const cmd = app.command(key).description(commands[key].description);
    const options = commands[key].options || [];

    options.forEach((option) => {
      cmd.addOption(
        new Option(option.usage, option.description).default(option.default),
      );
    });

    cmd.action(async (_, options) => {
      // Pass command options to scripts as environment variables prefixed with `__CMDOPTS_${name}`.
      const opts = options.opts() as Record<string, unknown>;
      const optsEnvVars = Object.keys(opts).reduce((acc, current) => {
        const constantOptName = changeCase.constantCase(current);
        return Object.assign(acc, {
          [`__CMDOPTS_${constantOptName}`]: opts[current],
        });
      }, {});

      await execaNode(resolveScript(commands[key].path), [], {
        stdio: "inherit",
        env: {
          __TAILORDEV_LOGLEVEL: logLevel,
          ...baseEnv,
          ...optsEnvVars,
        },
      });
    });
  });
};

// register custom commands
const registerCustomCommands = (
  app: Command,
  logger: LevelledLogger,
  logLevel: LogLevel,
) => {
  const config = getConfig();
  const commandKeys = Object.keys(config?.custom || {});
  const custom = app
    .command("custom")
    .description("custom commands")
    .action(() => {
      if (commandKeys.length === 0) {
        logger.info("CLI", "no custom script registed");
      }
      logger.debug("CLI", `reading custom: ${JSON.stringify(commandKeys)}`);
      custom.help();
    });

  Object.keys(config?.custom || {}).forEach((name) => {
    const cmd = config?.custom[name];
    if (!cmd) {
      return;
    }

    custom.addCommand(
      new Command(name).description(cmd.description).action(async () => {
        await execaNode(cmd.path, [], {
          stdio: "inherit",
          env: {
            __TAILORDEV_LOGLEVEL: logLevel,
            ...baseEnv,
          },
        });
      }),
    );
  });
};

const runCLI = async (argv?: readonly string[]) => {
  const { Command } = await import("@commander-js/extra-typings");
  const program = new Command();
  const logger = new LevelledLogger();

  program.configureHelp({
    sortSubcommands: true,
    sortOptions: true,
  });

  let scriptLogLevel: LogLevel = "info";
  const app = program
    .name("tailordev")
    .description("CLI for Tailor Platform application devs")
    .option("--verbose", "enable verbosity", false)
    .version("0.0.1")
    .hook("preAction", (options) => {
      const opts = options.opts();
      if (opts.verbose) {
        scriptLogLevel = "debug";
        logger.setLevel(scriptLogLevel);
        logger.debug("CLI", "enabled verbose mode");
      }
    });

  registerBuiltinCommands(app, scriptLogLevel);
  registerCustomCommands(app, logger, scriptLogLevel);
  app.parse(argv);
};

runCLI(process.argv).catch((e) => {
  console.error("app", e instanceof Error ? e.message : e);
});
