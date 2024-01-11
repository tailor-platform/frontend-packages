import chalk from "chalk";
import { Eta } from "eta";
import ora from "ora";
import { printError } from "../support/error.js";
import { buildUsecase } from "../support/usecase.js";
import { createMinitailorDBSQL } from "../templates/0-minitailor-database.sql.js";
import { composeYaml } from "../templates/compose.yaml.js";
import { ApplyOpts, applyCmd } from "./apply.js";

type StartOpts = ApplyOpts & {
  apply: boolean;
};

export const startCmd = buildUsecase<StartOpts>(
  async ({
    resource,
    deptools,
    dockerCompose,
    cuelang,
    tailorctl,
    config,
    args,
  }) => {
    const createSpinner = ora("generating configuration").start();

    try {
      const eta = new Eta();

      // mintailor.log
      await resource.createEmptyLogFile();

      // compose.yaml
      const composeYamlFile = eta.renderString(
        composeYaml({
          port: config?.config.port,
        }),
        {},
      );
      await resource.createComposeConfig(composeYamlFile);

      // sql
      const sqlFile = eta.renderString(createMinitailorDBSQL, {});
      await resource.createInitSQL(sqlFile);
      createSpinner.succeed();
    } catch (e) {
      createSpinner.fail();
      printError(e);
      return;
    }

    const composeSpinner = ora("running local environment").start();
    try {
      await dockerCompose.upAll();
      composeSpinner.succeed();
    } catch (e) {
      composeSpinner.fail();
      printError(e);
      return;
    }

    if (args.apply) {
      try {
        await applyCmd({
          resource,
          deptools,
          dockerCompose,
          cuelang,
          tailorctl,
        })(args, config);
      } catch (e) {
        printError(e);
        return;
      }
    } else {
      console.log(chalk.bold.white("\nYour backend is now up and running!"));
      console.log(
        `Hint: you can hit this with "--apply" to apply manifests at once on starting environment.`,
      );
    }
  },
);
