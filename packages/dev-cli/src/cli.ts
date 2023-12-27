import { applyCmd } from "./usecase/apply.js";
import { installCmd } from "./usecase/install.js";
import { resetCmd } from "./usecase/reset.js";
import { startCmd } from "./usecase/start.js";
import { uninstallCmd } from "./usecase/uninstall.js";

export const runCLI = async (argv?: readonly string[]) => {
  const { Command } = await import("@commander-js/extra-typings");
  const program = new Command();

  program
    .name("tailordev")
    .description("CLI for Tailor Platform application devs")
    .version("0.0.1");

  program
    .command("reset")
    .description("reset current state")
    .action(async () => await resetCmd());

  program
    .command("start")
    .description("start local development environment")
    .option("--apply", "apply after starting up environment", false)
    .option("--env <value>", "enviroment to apply", "local")
    .action(async (_, options) => await startCmd(options.opts()));

  program
    .command("apply")
    .description("apply manifest onto local environment")
    .option("--env <value>", "environment to apply", "local")
    .action(async (_, options) => {
      await applyCmd(options.opts());
    });

  program
    .command("install:deps")
    .description("install required dependencies (tailorctl, cuelang)")
    .option("--gh-token <value>", "github token to download assets")
    .option(
      "--tailorctl-version <version>",
      "tailorctl version to download",
      "v0.7.8"
    )
    .option(
      "--cuelang-version <version>",
      "cuelang version to download",
      "v0.7.0"
    )
    .action(async (_, options) => {
      await installCmd(options.opts());
    });

  program
    .command("uninstall:deps")
    .description("uninstall dependencies")
    .action(async () => await uninstallCmd());

  program.parse(argv);
};
