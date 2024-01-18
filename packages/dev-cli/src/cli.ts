import { cliCuelangAdapter } from "./interfaces/cuelang.js";
import { cliDeptoolsAdapter } from "./interfaces/deptools.js";
import { cliDockerComposeAdapter } from "./interfaces/docker.js";
import { cliResourceAdapter } from "./interfaces/resource.js";
import { cliTailorctlAdapter } from "./interfaces/tailorctl.js";
import { getConfig, isV2 } from "./support/config.js";
import { applyCmd as applyV1Cmd } from "./usecase/v1/apply.js";
import { installCmd } from "./usecase/install.js";
import { importCmd } from "./usecase/minitailor.js";
import { resetCmd } from "./usecase/v1/reset.js";
import { startCmd } from "./usecase/start.js";
import { uninstallCmd } from "./usecase/uninstall.js";
import { applyCmd } from "./usecase/v2/apply.js";
import { terminal } from "./support/logger.js";

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

  const runResetCmd = resetCmd(deps);
  app
    .command("reset")
    .description("reset local dev environment")
    .option("--only-stop", "only shutdown environment but keep files", false)
    .action((_, options) => runResetCmd(options.opts(), getConfig()));

  const runStartCmd = startCmd(deps);
  app
    .command("start")
    .description("start local dev environment")
    .option("--apply", "apply after starting up environment", false)
    .option("--only-file", "only generate files", false)
    .option("--env <value>", "enviroment to apply", "local")
    .action((_, options) => runStartCmd(options.opts(), getConfig()));

  const runV1ApplyCmd = applyV1Cmd(deps);
  const runV2ApplyCmd = applyCmd(deps);
  app
    .command("apply")
    .description("apply manifest onto local environment")
    .option("--only-eval", "only evaluate manifests", false)
    .option("--env <value>", "environment to apply", "local")
    .action((_, options) => {
      const config = getConfig();
      (isV2(config) ? runV2ApplyCmd : runV1ApplyCmd)(options.opts(), config);
    });

  const runImportCmd = importCmd(deps);
  app
    .command("import")
    .requiredOption("--host <value>", "target host")
    .argument("<paths...>")
    .description(
      "import seed manifest (this needs minitailor running by `start` command)",
    )
    .action((paths, options) => {
      runImportCmd({ paths, host: options.host }, getConfig());
    });

  const runInstallCmd = installCmd(deps);
  app
    .command("install:deps")
    .description("install required dependencies (tailorctl, cuelang)")
    .option(
      "--tailorctl-version <version>",
      "tailorctl version to download",
      "v0.7.12",
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
  app
    .command("uninstall:deps")
    .description("uninstall dependencies")
    .action(() => runUninstallCmd(null, getConfig()));

  app.parse(argv);
};
