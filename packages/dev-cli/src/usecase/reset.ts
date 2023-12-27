import { v2 as compose } from "docker-compose";
import { rm, stat } from "fs/promises";
import ora from "ora";
import path from "path";
import { getConfig } from "../support/config.js";
import { printError } from "../support/error.js";

export const resetCmd = async () => {
  const resource = getConfig();
  const composeSpinner = ora("stopping local environment");
  const resourcePath = path.join(".", ".tailordev");
  const composePath = path.join(resourcePath, "compose.yaml");

  try {
    const composeFileExists = await stat(composePath)
      .then(() => true)
      .catch(() => false);

    if (composeFileExists) {
      composeSpinner.start();
      await compose.down({
        config: composePath,
        commandOptions: ["--volumes", "--remove-orphans"],
        composeOptions: resource?.config.name
          ? ["-p", resource.config.name]
          : [],
      });
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
    await rm(resourcePath, {
      recursive: true,
      force: true,
    });
    fileDeletingSpinner.succeed();
  } catch (e) {
    fileDeletingSpinner.fail();
    printError(e);
    return;
  }
};
