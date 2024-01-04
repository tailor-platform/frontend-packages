import ora from "ora";
import { printError } from "../support/error.js";
import { buildUsecase } from "../support/usecase.js";

export const resetCmd = buildUsecase(async ({ resource, dockerCompose }) => {
  const composeSpinner = ora("stopping local environment");

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

  const fileDeletingSpinner = ora("deleting generated files");
  try {
    fileDeletingSpinner.start();
    await resource.deleteAll();
    fileDeletingSpinner.succeed();
  } catch (e) {
    fileDeletingSpinner.fail();
    printError(e);
    return;
  }
});
