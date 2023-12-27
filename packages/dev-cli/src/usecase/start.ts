import { v2 as compose } from "docker-compose";
import ora from "ora";
import path from "path";
import { getConfig } from "../support/config.js";
import { printError } from "../support/error.js";
import { Eta } from "eta";
import { mkdir, writeFile } from "fs/promises";
import { createMinitailorDBSQL } from "../templates/0-minitailor-database.sql.js";
import { composeYaml } from "../templates/compose.yaml.js";
import chalk from "chalk";
import { ApplyOpts, applyCmd } from "./apply.js";

type StartOpts = ApplyOpts & {
  apply: boolean;
};

export const startCmd = async (opts: StartOpts) => {
  const resource = getConfig();
  const createSpinner = ora("generating configuration").start();

  try {
    const resourceDir = path.join(".", ".tailordev");
    const dbinitDir = path.join(resourceDir, "db", "init");
    await mkdir(dbinitDir, {
      recursive: true,
    });

    const eta = new Eta();

    // compose.yaml
    const composeYamlFile = eta.renderString(
      composeYaml({
        port: resource?.config.port,
      }),
      {}
    );
    await writeFile(
      path.join(resourceDir, "compose.yaml"),
      composeYamlFile.trim()
    );

    // sql
    const sqlFile = eta.renderString(createMinitailorDBSQL, {});
    await writeFile(
      path.join(dbinitDir, "0-minitailor-database.sql"),
      sqlFile.trim()
    );

    createSpinner.succeed();
  } catch (e) {
    createSpinner.fail();
    printError(e);
    return;
  }

  const composeSpinner = ora("running local environment").start();
  try {
    await compose.upAll({
      config: path.join(".", ".tailordev", "compose.yaml"),
      commandOptions: ["--detach"],
      composeOptions: resource?.config.name ? ["-p", resource.config.name] : [],
    });
    composeSpinner.succeed();
  } catch (e) {
    composeSpinner.fail();
    printError(e);
    return;
  }

  if (opts.apply) {
    try {
      await applyCmd(opts);
    } catch (e) {
      printError(e);
      return;
    }
  } else {
    console.log(chalk.bold.white("\nYour backend is now up and running!"));
    console.log(
      `Hint: you can hit this with "--apply" to apply manifests at once on starting environment.`
    );
  }
};
