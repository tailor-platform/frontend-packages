import path from "path";
import { fileIO } from "./resource.js";
import { $$, getConfig, log, tailorctl } from "@script/index.js";
import { createGenerateDist } from "./applyV1.js";

const config = getConfig();

export const applyV2 = async () => {
  await log.group("apply", "evaluating manifest", async () => {
    await $$`${tailorctl} alpha manifest tidy`;
    await createGenerateDist();
    await fileIO.copyCueMod();
  });

  if (process.env.__CMDOPTS_ONLY_EVAL === "true") {
    return;
  }

  await log.group("apply", "creating workspace", async () => {
    await $$`${tailorctl} alpha workspace create --name ${config?.name || ""} --region local`;
    if (process.env.__CMDOPTS_DEFAULT_VAULT === "true") {
      await $$`${tailorctl} alpha workspace vault create --name default`;
    }
  });

  await log.group("apply", "applying manifest", async () => {
    const appEnv = process.env.__CMDOPTS_ENV || "";
    const manifest = path.join(config?.manifest || "", config?.target[0] || "");
    await $$`${tailorctl} alpha workspace apply --auto-approve --envs ${appEnv} -m ${manifest}`;
  });
};
