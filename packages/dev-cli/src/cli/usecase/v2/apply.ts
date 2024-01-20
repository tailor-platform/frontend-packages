import chalk from "chalk";
import { handleError } from "../../support/error.js";
import { buildUsecase } from "../../support/usecase.js";
import {
  ApplyOpts,
  NoTargetFileError,
  createGenerateDist,
} from "../v1/apply.js";
import { Tailorctl } from "../../interfaces/tailorctl.js";
import { defaultMinitailorPort } from "../../templates/compose.yaml.js";
import { terminal } from "../../support/logger.js";

export const applyCmd = buildUsecase<ApplyOpts>(
  async ({ resource, cuelang, tailorctl, args, config }) => {
    const targetFiles = config?.target || [];
    if (targetFiles.length === 0) {
      handleError("apply", NoTargetFileError);
      return;
    }

    try {
      await manifestTidy(tailorctl);
      await createGenerateDist(resource, cuelang, args, targetFiles);
      await resource.copyCueMod();
    } catch (e) {
      handleError("apply", e);
      return;
    }

    if (!args.onlyEval) {
      const applySpinner = terminal.spinner("applying manifests").start();
      try {
        // TODO: here needs validation beforehand to make `name` non-optional
        await tailorctl.createWorkspace(config?.name || "", {
          onRunning: (msg) => {
            terminal.info("workspace", msg);
          },
        });
        await tailorctl.createVault();
        await tailorctl.apply(args.env, {
          onRunning: (msg) => {
            terminal.info("apply", msg);
          },
        });
        applySpinner.succeed();
      } catch (e) {
        applySpinner.fail();
        handleError("apply", e);
        return;
      }

      // tailorctl.apps() needs some waits to get manifests applied in minitailor.
      const waitForAppTimeout = 5000;
      const waitSpinner = terminal.spinner("waiting app").start();
      try {
        setTimeout(async () => {
          const apps = await tailorctl.apps();
          waitSpinner.succeed();

          terminal.debug(
            "app",
            JSON.stringify({
              apps,
            }),
          );

          if (apps.length > 0) {
            terminal.infoWithoutPrefix(
              chalk.bold.white("\nHooray! Your backend is now up and running."),
              `Playground: http://${apps[0].domain}:${defaultMinitailorPort}/playground`,
            );
          }
        }, waitForAppTimeout);
      } catch (e) {
        waitSpinner.fail();
        handleError("app", e);
        return;
      }
    }
  },
);

export const manifestTidy = async (tailorctl: Tailorctl) => {
  const syncSpinner = terminal.spinner("synchronizing cue.mod");
  try {
    syncSpinner.start();
    await tailorctl.tidy();
    syncSpinner.succeed("cue.mod synchronized");
  } catch (e) {
    syncSpinner.fail();
    throw e;
  }
};
