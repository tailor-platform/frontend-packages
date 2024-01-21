import { cliResourceAdapter, composePath } from "../cli/interfaces/resource.js";
import {
  composeYaml,
  defaultProfileName,
} from "../cli/templates/compose.yaml.js";
import { Eta } from "eta";
import { dockerCompose, getConfig, log } from "../script/index.js";
import { createMinitailorDBSQL } from "../cli/templates/0-minitailor-database.sql.js";
import { cwd } from "node:process";

const config = getConfig();

await log.group("config", "generation", async () => {
  const eta = new Eta();

  // mintailor.log
  await cliResourceAdapter.createEmptyLogFile();

  // compose.yaml
  const composeYamlFile = eta.renderString(composeYaml({}), {});
  await cliResourceAdapter.createComposeConfig(composeYamlFile);

  // sql
  const sqlFile = eta.renderString(createMinitailorDBSQL, {});
  await cliResourceAdapter.createInitSQL(sqlFile);
});

await log.group("dev environment", "launch", async () => {
  const appName = config?.name || "";
  await dockerCompose([
    "-f",
    composePath,
    "--profile",
    defaultProfileName,
    "--project-directory",
    cwd(),
    "-p",
    appName,
    "up",
    "-d",
  ]);
});
