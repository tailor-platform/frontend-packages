import { terminal } from "./support/logger.js";
import { execaNode } from "execa";
import path from "path";
import { Option } from "@commander-js/extra-typings";
import * as changeCase from "change-case";

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

  type Commands = Record<
    string,
    {
      description: string;
      file: string;
      options?: {
        usage: string;
        description: string;
        default: unknown;
      }[];
    }
  >;

  const commands: Commands = {
    start: {
      description: "start local dev environment",
      file: "start.js",
      options: [
        {
          usage: "--only-file",
          description: "only geneate files",
          default: false,
        },
        {
          usage: "--env <value>",
          description: "environment to apply",
          default: "local",
        },
        {
          usage: "--apply",
          description: "apply after starting up environment",
          default: false,
        },
      ],
    },
    reset: {
      description: "reset local dev environment",
      file: "reset.js",
    },
    apply: {
      description: "apply manifest onto local environment",
      file: "apply.js",
      options: [
        {
          usage: "--env <value>",
          description: "environment to apply",
          default: "local",
        },
        {
          usage: "--only-eval",
          description: "only evaluate manifests",
          default: false,
        },
      ],
    },
    "install:deps": {
      description: "install required dependencies (tailorctl, cuelang)",
      file: "install-deps.js",
      options: [
        {
          usage: "--tailorctl-version <version>",
          description: "tailorctl version to download",
          default: "v0.7.12",
        },
        {
          usage: "--cuelang-version <version>",
          description: "cuelang version to download",
          default: "v0.7.0",
        },
      ],
    },
    "uninstall:deps": {
      description: "uninstall dependencies",
      file: "uninstall-deps.js",
      options: [],
    },
  } as const;

  const resolveScript = (name: string) => {
    const pathWithProtocol = new URL(import.meta.url);
    return path.join(pathWithProtocol.pathname, `../builtin/${name}`);
  };

  Object.keys(commands).forEach((key) => {
    const cmd = app.command(key).description(commands[key].description);
    const options = commands[key].options || [];

    options.forEach((option) => {
      cmd.addOption(
        new Option(option.usage, option.description).default(option.default),
      );
    });

    cmd.action(async (_, options) => {
      // Pass command options as environment variables prefixed with `__CMDOPTS_${name}`.
      const opts = options.opts() as Record<string, unknown>;
      const optsEnvVars = Object.keys(opts).reduce((acc, current) => {
        const constantOptName = changeCase.constantCase(current);
        return Object.assign(acc, {
          [`__CMDOPTS_${constantOptName}`]: opts[current],
        });
      }, {});

      await execaNode(resolveScript(commands[key].file), [], {
        stdio: "inherit",
        env: {
          APP_HTTP_SCHEMA: "http",
          PLATFORM_URL: "http://mini.tailor.tech:18090",
          TAILOR_TOKEN: "tpp_11111111111111111111111111111111",
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
