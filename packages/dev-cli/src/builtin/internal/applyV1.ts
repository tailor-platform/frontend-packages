import path from "path";
import {
  cliResourceAdapter,
  generatedPath,
} from "../../cli/interfaces/resource.js";
import { cue, getConfig, log, tailorctl } from "../../script/index.js";

const config = getConfig();

export const applyV1 = async () => {
  await log.group("apply", "linting", async () => {
    await tailorctl(["cue", "sync"]);
    await createGenerateDist();
    await cliResourceAdapter.copyCueMod();

    // TODO: impement here
  });
};

export const createGenerateDist = async () => {
  await cliResourceAdapter.createGeneratedDist();
  await Promise.all(
    config?.target.map(async (f) => {
      const file = path.join(config?.manifest, f);
      const outPath = path.join(generatedPath, f);
      log.info("apply", `evaluating... (${file})`);
      await cue(["vet", "-t", process.env.APP_ENV || "", "-c", file]);
      await cue([
        "eval",
        "-f",
        "-t",
        process.env.APP_ENV || "",
        file,
        "-o",
        outPath,
      ]);
    }) || [],
  );
};
