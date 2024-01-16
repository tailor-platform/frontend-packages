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
      const applySpinner = ora("applying manifests");
      try {
        // TODO: here needs validation beforehand to make `name` non-optional
        await tailorctl.createWorkspace(config?.name || "");
        await tailorctl.createVault();
        await tailorctl.apply(config?.target[0] || "");
        applySpinner.succeed();
      } catch (e) {
        applySpinner.fail();
        printError(e);
        return;
      }

      console.log(
        chalk.bold.white("\nHooray! Your backend is now up and running."),
      );
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
