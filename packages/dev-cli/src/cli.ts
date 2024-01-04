import { cliCuelangAdapter } from "./interfaces/cuelang.js";
import { cliDeptoolsAdapter } from "./interfaces/deptools.js";
import { cliDockerComposeAdapter } from "./interfaces/docker.js";
import { cliResourceAdapter } from "./interfaces/resource.js";
import { cliTailorctlAdapter } from "./interfaces/tailorctl.js";
import { getConfig } from "./support/config.js";
import { applyCmd } from "./usecase/apply.js";
import { installCmd } from "./usecase/install.js";
import { resetCmd } from "./usecase/reset.js";
import { startCmd } from "./usecase/start.js";
import { uninstallCmd } from "./usecase/uninstall.js";

export const runCLI = async (argv?: readonly string[]) => {
  const { Command } = await import("@commander-js/extra-typings");
  const program = new Command();
  const deps = {
    resource: cliResourceAdapter,
    deptools: cliDeptoolsAdapter,
    dockerCompose: cliDockerComposeAdapter,
    cuelang: cliCuelangAdapter,
    tailorctl: cliTailorctlAdapter,
  };

  program
    .name("tailordev")
    .description("CLI for Tailor Platform application devs")
    .version("0.0.1");

  const runResetCmd = resetCmd(deps);
  program
    .command("reset")
    .description("reset current state")
    .action(() => runResetCmd(null, getConfig()));

  const runStartCmd = startCmd(deps);
  program
    .command("start")
    .description("start local development environment")
    .option("--apply", "apply after starting up environment", false)
    .option("--env <value>", "enviroment to apply", "local")
    .action((_, options) => runStartCmd(options.opts(), getConfig()));

  const runApplyCmd = applyCmd(deps);
  program
    .command("apply")
    .description("apply manifest onto local environment")
    .option("--env <value>", "environment to apply", "local")
    .action((_, options) => {
      runApplyCmd(options.opts(), getConfig());
    });

  const runInstallCmd = installCmd(deps);
  program
    .command("install:deps")
    .description("install required dependencies (tailorctl, cuelang)")
    .option("--gh-token <value>", "github token to download assets")
    .option(
      "--tailorctl-version <version>",
      "tailorctl version to download",
      "v0.7.8",
    )
    .option(
      "--cuelang-version <version>",
      "cuelang version to download",
      "v0.7.0",
    )
    .action((_, options) => {
      runInstallCmd(options.opts(), getConfig());
    });

  const runUninstallCmd = uninstallCmd(deps);
  program
    .command("uninstall:deps")
    .description("uninstall dependencies")
    .action(() => runUninstallCmd(null, getConfig()));

  program.parse(argv);
};
