import chalk from "chalk";
import ora from "ora";
import { printError } from "../../support/error.js";
import { buildUsecase } from "../../support/usecase.js";
import { SpawnProcessError } from "../../support/process.js";
import { Tailorctl } from "../../interfaces/tailorctl.js";
import { Resource } from "../../interfaces/resource.js";
import { Cuelang } from "../../interfaces/cuelang.js";

export const NoTargetFileError = new Error("no target file specified");

export type ApplyOpts = {
  env: string;
  onlyEval: boolean;
};

export const applyCmd = buildUsecase<ApplyOpts>(
  async ({ resource, dockerCompose, cuelang, tailorctl, args, config }) => {
    const targetFiles = config?.target || [];
    if (targetFiles.length === 0) {
      printError(NoTargetFileError);
      return;
    }

    try {
      await synchoronizeCueMod(tailorctl);
      await createGenerateDist(resource, cuelang, args, targetFiles);
      await resource.copyCueMod();
    } catch (e) {
      printError(e);
      return;
    }

    if (!args.onlyEval) {
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
        chalk.bold.white("\nHooray! Your backend is now up and running."),
      );
    }
  },
);

const synchoronizeCueMod = async (tailorctl: Tailorctl) => {
  const syncSpinner = ora("synchronizing cue.mod");
  try {
    syncSpinner.start();
    await tailorctl.sync();
    syncSpinner.succeed("cue.mod synchronized");
  } catch (e) {
    syncSpinner.fail();
    throw e;
  }
};

export const createGenerateDist = async (
  resource: Resource,
  cuelang: Cuelang,
  args: ApplyOpts,
  targetFiles: string[],
) => {
  await resource.createGeneratedDist();
  await Promise.all(
    targetFiles.map(async (file) => {
      const compilingSpinner = ora(`linting manifest (${file})`).start();

      try {
        await cuelang.vet(args.env, file);
        compilingSpinner.start(`evaluating manifest (${file})`);

        await cuelang.eval(args.env, file);
        compilingSpinner.succeed(`linted and evaluated (${file})`);
      } catch (e: unknown) {
        compilingSpinner.fail();
        if (e instanceof SpawnProcessError) {
          console.log(`${chalk.bold.yellow("[apply]")} ${e.errors.join()}`);
        } else {
          throw e;
        }
      }
    }),
  );
};