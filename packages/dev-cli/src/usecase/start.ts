import chalk from "chalk";
import { Eta } from "eta";
import { handleError } from "../support/error.js";
import { buildUsecase } from "../support/usecase.js";
import { createMinitailorDBSQL } from "../templates/0-minitailor-database.sql.js";
import { composeYaml } from "../templates/compose.yaml.js";
import { ApplyOpts, applyCmd as runV1ApplyCmd } from "./v1/apply.js";
import { applyCmd as runV2ApplyCmd } from "./v2/apply.js";
import { isV2 } from "../support/config.js";
import { terminal } from "../support/logger.js";

type StartOpts = Omit<ApplyOpts, "onlyEval"> & {
  onlyFile: boolean;
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
    const createSpinner = terminal.spinner("generating configuration").start();

    try {
      const eta = new Eta();

      // mintailor.log
      await resource.createEmptyLogFile();

      // compose.yaml
      const composeYamlFile = eta.renderString(
        composeYaml({
          port: config?.port,
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
      handleError("start", e);
      return;
    }

    if (args.onlyFile) {
      return;
    }

    const composeSpinner = terminal
      .spinner("running local environment")
      .start();
    try {
      await dockerCompose.up();
      composeSpinner.succeed();
    } catch (e) {
      composeSpinner.fail();
      handleError("start", e);
      return;
    }

    if (args.apply) {
      try {
        await (isV2(config) ? runV2ApplyCmd : runV1ApplyCmd)({
          resource,
          deptools,
          dockerCompose,
          cuelang,
          tailorctl,
        })(
          {
            // start command does not have to support --only-eval option
            onlyEval: false,
            env: args.env,
          },
          config,
        );
      } catch (e) {
        handleError("apply", e);
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
