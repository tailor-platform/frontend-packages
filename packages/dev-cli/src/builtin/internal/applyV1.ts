import path from "path";
import { fileIO, generatedPath } from "./resource.js";
import {
  $$,
  cue,
  getConfig,
  log,
  minitailor,
  tailorctl,
} from "@script/index.js";

const config = getConfig();

export const applyV1 = async () => {
  await log.group("apply", "linting", async () => {
    await $$`${tailorctl} cue sync`;
    await createGenerateDist();
    await fileIO.copyCueMod();
  });

  if (process.env.__CMDOPTS_ONLY_EVAL === "true") {
    return;
  }

  await log.group("apply", "applying manifest", async () => {
    await $$`${minitailor} apply -m /root/backend/generated`;
  });
};

export const createGenerateDist = async () => {
  const appEnv = process.env.__CMDOPTS_ENV || "";

  await fileIO.createGeneratedDist();
  await Promise.all(
    config?.target.map(async (f) => {
      const file = path.join(config?.manifest, f);
      const outPath = path.join(generatedPath, f);
      log.info("apply", `evaluating... (${file})`);
      await $$`${cue} vet -t ${appEnv} -c ${file}`;
      await $$`${cue} eval -f -t ${appEnv} ${file} -o ${outPath}`;
    }) || [],
  );
};
