import { $$, getConfig, log, tailorctl } from "@script/index.js";
import { applyV1 } from "./internal/applyV1.js";
import { applyV2 } from "./internal/applyV2.js";
import { fileIO } from "./internal/resource.js";
import { dockerCompose } from "@script/helper.js";

const config = getConfig();

await log.group("config", "generation", async () => {
  // mintailor.log
  await fileIO.createEmptyLogFile();

  // compose.yaml
  await fileIO.createComposeConfig();

  // sql
  await fileIO.createInitSQL();
});

if (process.env.__CMDOPTS_ONLY_FILE === "true") {
  process.exit(0);
}

await log.group("dev environment", "launch", async () => {
  await $$`${dockerCompose} up -d`;
});

await log.group("apply", "creating workspace", async () => {
  await $$`${tailorctl} alpha workspace create --name ${config?.name || ""}`;
  await $$`${tailorctl} alpha workspace vault create --name default`;
});

if (process.env.__CMDOPTS_APPLY === "true") {
  await (config?.version === "v2" ? applyV2 : applyV1)();
}
