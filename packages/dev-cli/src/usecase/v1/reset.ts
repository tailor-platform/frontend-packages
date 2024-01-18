import { printError } from "../../support/error.js";
import { terminal } from "../../support/logger.js";
import { buildUsecase } from "../../support/usecase.js";

type ResetOpts = {
  onlyStop: boolean;
};

export const resetCmd = buildUsecase<ResetOpts>(
  async ({ resource, dockerCompose, args }) => {
    const composeSpinner = terminal.spinner("stopping local environment");

    try {
      const composePath = await resource.existsComposeConfig();
      if (composePath) {
        composeSpinner.start();
        await dockerCompose.down();
      }
      composeSpinner.succeed();
    } catch (e) {
      composeSpinner.fail();
      printError(e);
      return;
    }

    if (!args.onlyStop) {
      const fileDeletingSpinner = terminal.spinner("deleting generated files");
      try {
        fileDeletingSpinner.start();
        await resource.deleteAll();
        fileDeletingSpinner.succeed();
      } catch (e) {
        fileDeletingSpinner.fail();
        printError(e);
        return;
      }
    }
  },
);
