import ora from "ora";
import { printError } from "../support/error.js";
import { buildUsecase } from "../support/usecase.js";

export const uninstallCmd = buildUsecase(async ({ deptools }) => {
  const deletingSpinner = ora("deleting deps").start();

  try {
    await deptools.deleteAll();
    deletingSpinner.succeed();
  } catch (e) {
    deletingSpinner.fail();
    printError(e);
    return;
  }
});
