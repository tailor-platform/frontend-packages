import { deptools } from "@builtin/internal/deptools.js";
import { log } from "@script/index.js";

await log.group("dependency", "uninstallation", async () => {
  await deptools.deleteAll();
});
