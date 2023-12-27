import { rm } from "fs/promises";
import ora from "ora";
import { destDir } from "../support/process.js";
import { printError } from "../support/error.js";

export const uninstallCmd = async () => {
  const deletingSpinner = ora("deleting deps").start();

  try {
    await rm(destDir, {
      recursive: true,
      force: true,
    });
    deletingSpinner.succeed();
  } catch (e) {
    deletingSpinner.fail();
    printError(e);
    return;
  }
};
