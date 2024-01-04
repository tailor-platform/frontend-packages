import chalk from "chalk";
import ora from "ora";
import { printError } from "../support/error.js";
import { buildUsecase } from "../support/usecase.js";
import { defaultMinitailorPort } from "../templates/compose.yaml.js";

export const NoTargetFileError = new Error("no target file specified");

export type ApplyOpts = { env: string };

export const applyCmd = buildUsecase<ApplyOpts>(
  async ({ resource, dockerCompose, cuelang, tailorctl, args, config }) => {
    const targetFiles = config?.config.target || [];
    if (targetFiles.length === 0) {
      printError(NoTargetFileError);
      return;
    }

    const syncSpinner = ora("synchronizing cue.mod");
    try {
      syncSpinner.start();
      await tailorctl.sync();
      syncSpinner.succeed("cue.mod synchronized");
    } catch (e) {
      syncSpinner.fail();
      printError(e);
      return;
    }

    try {
      await resource.createGeneratedDist();
      await Promise.all(
        targetFiles?.map(async (file) => {
          const compilingSpinner = ora(`linting manifest (${file})`).start();

          try {
            await cuelang.vet(args.env, file);
            compilingSpinner.start(`evaluating manifest (${file})`);

            await cuelang.eval(args.env, file);
            compilingSpinner.succeed(`linted and evaluated (${file})`);
          } catch (e) {
            compilingSpinner.fail();
            throw e;
          }
        })
      );
    } catch (e) {
      printError(e);
      return;
    }

    try {
      await resource.copyCueMod();
    } catch (e) {
      printError(e);
      return;
    }

    const applySpinner = ora("applying manifests");
    try {
      await dockerCompose.apply({
        onRunning: (msg) => {
          console.log(`${chalk.bold.yellow("[apply]")} ${msg}`);
        },
      });

      applySpinner.succeed();
    } catch (e) {
      applySpinner.fail();
      printError(e);
      return;
    }

    console.log(
      chalk.bold.white("\nHooray! Your backend is now up and running.")
    );
    console.log(
      `Playground at: http://localhost:${
        config?.config.port || defaultMinitailorPort
      }/playground`
    );
  }
);
