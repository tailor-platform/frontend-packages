import { cwd } from "process";
import { fileIO } from "@builtin/internal/resource.js";
import { defaultProfileName } from "@builtin/templates/compose.yaml.js";
import { dockerCompose, getConfig, log } from "@script/index.js";

const config = getConfig();

await log.group("dev environment", "shutdown", async () => {
  const composePath = await fileIO.existsComposeConfig();
  if (composePath) {
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
      "down",
      "--remove-orphans",
      "--volumes",
    ]);
  }
});

await log.group("config", "cleanup", async () => {
  await fileIO.deleteAll();
});
