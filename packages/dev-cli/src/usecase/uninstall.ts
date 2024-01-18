import { printError } from "../support/error.js";
import { terminal } from "../support/logger.js";
import { buildUsecase } from "../support/usecase.js";

export const uninstallCmd = buildUsecase(async ({ deptools }) => {
  const deletingSpinner = terminal.spinner("deleting deps").start();

  try {
    await deptools.deleteAll();
    deletingSpinner.succeed();
  } catch (e) {
    deletingSpinner.fail();
    printError(e);
    return;
  }
});
