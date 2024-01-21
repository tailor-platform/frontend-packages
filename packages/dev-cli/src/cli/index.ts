import { terminal } from "./support/logger.js";
import { execaNode } from "execa";
import path from "path";
import { Option } from "@commander-js/extra-typings";
import * as changeCase from "change-case";
import { commands } from "./commands.js";

export const runCLI = async (argv?: readonly string[]) => {
  const { Command } = await import("@commander-js/extra-typings");
  const program = new Command();
  const app = program
    .name("tailordev")
    .description("CLI for Tailor Platform application devs")
    .option("--verbose", "enable verbosity", false)
    .version("0.0.1")
    .hook("preAction", (options) => {
      const opts = options.opts();
      if (opts.verbose) {
        terminal.setLevel("debug");
      }
    });

  const resolveScript = (filename: string) => {
    const pathWithProtocol = new URL(import.meta.url);
    return path.join(pathWithProtocol.pathname, `../${filename}.js`);
  };

  // Environment variables needed to bypass platform authorization on minitailor
  const minitailorEnv = {
    APP_HTTP_SCHEMA: "http",
    PLATFORM_URL: "http://mini.tailor.tech:18090",
    TAILOR_TOKEN: "tpp_11111111111111111111111111111111",
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
          ...minitailorEnv,
          ...optsEnvVars,
        },
      });
    });
  });

  app.parse(argv);
};

runCLI(process.argv).catch((e) => {
  terminal.error("app", e instanceof Error ? e.message : e);
});
