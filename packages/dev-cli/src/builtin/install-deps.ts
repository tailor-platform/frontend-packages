import { deptools } from "@builtin/internal/deptools.js";
import { log } from "@script/index.js";

await log.group("dependency", "installation", async () => {
  const downloadTailorctl = deptools.downloadTailorctl(
    process.env.__CMDOPTS_TAILORCTL_VERSION || "",
  );
  const downloadCuelang = deptools.downloadCuelang(
    process.env.__CMDOPTS_CUELANG_VERSION || "",
  );

  await Promise.all([
    downloadTailorctl.promise.then(() => {
      log.info(
        "tailorctl",
        `sucesssfully downloaded (package: ${downloadTailorctl.packageName})`,
      );
    }),
    downloadCuelang.promise.then(() => {
      log.info(
        "cuelang",
        `sucesssfully downloaded (package: ${downloadCuelang.packageName})`,
      );
    }),
  ]);
});
