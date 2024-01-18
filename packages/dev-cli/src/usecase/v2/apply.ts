import chalk from "chalk";
import ora from "ora";
import { printError } from "../../support/error.js";
import { buildUsecase } from "../../support/usecase.js";
import {
  ApplyOpts,
  NoTargetFileError,
  createGenerateDist,
} from "../v1/apply.js";
import { Tailorctl } from "../../interfaces/tailorctl.js";
import { SpawnProcessError } from "../../support/process.js";
import { defaultMinitailorPort } from "../../templates/compose.yaml.js";
import { logger } from "../../support/logger.js";

export const applyCmd = buildUsecase<ApplyOpts>(
  async ({ resource, cuelang, tailorctl, args, config }) => {
    const targetFiles = config?.target || [];
    if (targetFiles.length === 0) {
      printError(NoTargetFileError);
      return;
    }

    try {
      await manifestTidy(tailorctl);
      await createGenerateDist(resource, cuelang, args, targetFiles);
      await resource.copyCueMod();
    } catch (e) {
      printError(e);
      return;
    }

    if (!args.onlyEval) {
      const applySpinner = ora("applying manifests").start();
      try {
        // TODO: here needs validation beforehand to make `name` non-optional
        await tailorctl.createWorkspace(config?.name || "", {
          onRunning: (msg) => {
            logger.info("workspace", msg);
          },
        });
        await tailorctl.createVault();
        await tailorctl.apply({
          onRunning: (msg) => {
            logger.info("apply", msg);
          },
        });
        applySpinner.succeed();
      } catch (e) {
        applySpinner.fail();
        if (e instanceof SpawnProcessError) {
          logger.error("apply", e.errors.join());
        } else {
          printError(e);
        }
        return;
      }

      const waitSpinner = ora("waiting app").start();
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const apps = await tailorctl.apps();
        waitSpinner.succeed();

        if (apps.length > 0) {
          console.log(
            chalk.bold.white("\nHooray! Your backend is now up and running."),
            chalk.white(
              `\nPlayground: http://${apps[0].domain}:${defaultMinitailorPort}/playground`,
            ),
          );
        }
      } catch (e) {
        waitSpinner.fail();
        if (e instanceof SpawnProcessError) {
          logger.error("app", e.errors.join());
        } else {
          printError(e);
        }
        return;
      }
    }
  },
);

export const manifestTidy = async (tailorctl: Tailorctl) => {
  const syncSpinner = ora("synchronizing cue.mod");
  try {
    syncSpinner.start();
    await tailorctl.tidy();
    syncSpinner.succeed("cue.mod synchronized");
  } catch (e) {
    syncSpinner.fail();
    throw e;
  }
};
