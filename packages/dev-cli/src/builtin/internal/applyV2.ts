import chalk from "chalk";
import path from "path";
import { z } from "zod";
import { fileIO } from "./resource.js";
import { $, getConfig, log, tailorctl } from "@script/index.js";
import { createGenerateDist } from "./applyV1.js";

const config = getConfig();

export const applyV2 = async () => {
  await log.group("apply", "evaluating manifest", async () => {
    await tailorctl(["alpha", "manifest", "tidy"]);
    await createGenerateDist();
    await fileIO.copyCueMod();
  });

  if (process.env.__CMDOPTS_ONLY_EVAL === "true") {
    return;
  }

  await log.group("apply", "creating workspace", async () => {
    await tailorctl([
      "alpha",
      "workspace",
      "create",
      "--name",
      config?.name || "",
    ]);

    await tailorctl(["alpha", "vault", "create", "--name", "default"]);
  });

  await log.group("apply", "applying manifest", async () => {
    const appEnv = process.env.__CMDOPTS_ENV || "";

    await tailorctl([
      "alpha",
      "workspace",
      "apply",
      "--auto-approve",
      "--envs",
      appEnv,
      "-m",
      path.join(config?.manifest || "", config?.target[0] || ""),
    ]);
  });

  // tailorctl.apps() needs some waits to get manifests applied in minitailor.
  await $`sleep 3`;
  const workspaceApps = await tailorctl(
    ["alpha", "workspace", "app", "list", "--format", "json"],
    { stdio: "pipe" },
  );

  const appsResult = appsSchema.safeParse(JSON.parse(workspaceApps.stdout));
  if (appsResult.success && appsResult.data.length > 0) {
    log.infoWithoutPrefix(
      chalk.bold.white("\nHooray! Your backend is now up and running."),
      `Playground: http://${appsResult.data[0].domain}:${defaultMinitailorPort}/playground`,
    );
  } else {
    log.error("apps", "failed reading apps");
  }
};

const appsSchema = z.array(
  z.object({
    created: z.string().datetime(),
    updated: z.string().datetime(),
    domain: z.string(),
    name: z.string(),
  }),
);
