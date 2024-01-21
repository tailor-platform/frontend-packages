import { cliDeptoolsAdapter } from "@cli/interfaces/deptools.js";
import { log } from "@script/index.js";

await log.group("dependency", "uninstallation", async () => {
  await cliDeptoolsAdapter.deleteAll();
});
