import { v2 as compose } from "docker-compose";
import { cp, mkdir } from "fs/promises";
import ora from "ora";
import path from "path";
import { getConfig } from "../support/config.js";
import { printError } from "../support/error.js";
import {
  cuelangBinary,
  spawnExecutable,
  tailorctlBinary,
} from "../support/process.js";
import chalk from "chalk";
import { defaultMinitailorPort } from "../templates/compose.yaml.js";

export type ApplyOpts = { env: string };

export const applyCmd = async (opts: ApplyOpts) => {
  const resource = getConfig();
  const targetFiles = resource?.config.target || [];

  const syncSpinner = ora("synchronizing cue.mod");
  try {
    syncSpinner.start();
    await spawnExecutable(tailorctlBinary, ["cue", "sync"]);
    syncSpinner.succeed("cue.mod synchronized");
  } catch (e) {
    syncSpinner.fail();
    printError(e);
    return;
  }

  try {
    await mkdir(path.join(".", ".tailordev", "generated"), { recursive: true });
    await Promise.all(
      targetFiles?.map(async (file) => {
        const compilingSpinner = ora(`linting manifest (${file})`).start();

        try {
          await spawnExecutable(cuelangBinary, [
            "vet",
            "-t",
            opts.env,
            "-c",
            path.join(resource?.config.manifest || "", file),
          ]);

          compilingSpinner.start(`evaluating manifest (${file})`);
          await spawnExecutable(cuelangBinary, [
            "eval",
            "-f",
            "-t",
            opts.env,
            path.join(resource?.config.manifest || "", file),
            "-o",
            path.join(".", ".tailordev", "generated", file),
          ]);

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
    await cp(
      path.join(".", "cue.mod"),
      path.join(".", ".tailordev", "cue.mod"),
      {
        recursive: true,
      }
    );
  } catch (e) {
    printError(e);
    return;
  }

  const applySpinner = ora("applying manifests");
  try {
    await compose.exec(
      "minitailor",
      ["/root/app", "apply", "-m", "/root/backend/generated"],
      {
        config: path.join(".", ".tailordev", "compose.yaml"),
        composeOptions: resource?.config.name
          ? ["-p", resource.config.name]
          : [],
        callback: (chunk) => {
          console.log(
            `${chalk.bold.yellow("[apply]")} ${chunk.toString().trim()}`
          );
        },
      }
    );

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
      resource?.config.port || defaultMinitailorPort
    }/playground`
  );
};
