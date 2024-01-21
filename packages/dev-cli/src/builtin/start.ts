import { fileIO } from "./internal/resource.js";
import { composeYaml } from "@builtin/templates/compose.yaml.js";
import { Eta } from "eta";
import { dockerCompose, getConfig, log } from "@script/index.js";
import { createMinitailorDBSQL } from "@builtin/templates/0-minitailor-database.sql.js";
import { applyV1 } from "./internal/applyV1.js";
import { applyV2 } from "./internal/applyV2.js";

const config = getConfig();

await log.group("config", "generation", async () => {
  const eta = new Eta();

  // mintailor.log
  await fileIO.createEmptyLogFile();

  // compose.yaml
  const composeYamlFile = eta.renderString(composeYaml({}), {});
  await fileIO.createComposeConfig(composeYamlFile);

  // sql
  const sqlFile = eta.renderString(createMinitailorDBSQL, {});
  await fileIO.createInitSQL(sqlFile);
});

if (process.env.__CMDOPTS_ONLY_FILE === "true") {
  process.exit(0);
}

await log.group("dev environment", "launch", async () => {
  await dockerCompose(["up", "-d"]);
});

if (process.env.__CMDOPTS_APPLY === "true") {
  await (config?.version === "v2" ? applyV2 : applyV1)();
}
