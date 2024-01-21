import { fileIO } from "@builtin/internal/resource.js";
import { dockerCompose, log } from "@script/index.js";

await log.group("dev environment", "shutdown", async () => {
  const composePath = await fileIO.existsComposeConfig();
  if (composePath) {
    await dockerCompose(["down", "--remove-orphans", "--volumes"]);
  }
});

await log.group("config", "cleanup", async () => {
  await fileIO.deleteAll();
});
