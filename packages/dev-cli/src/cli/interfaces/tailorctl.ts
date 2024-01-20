import path from "path";
import {
  SpawnProcessError,
  spawnExecutable,
  tailorctlBinary,
} from "../support/process.js";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { getConfig } from "../support/config.js";

type RunningCallbacks = {
  onRunning?: (msg: string) => void;
};

const appsSchema = z.array(
  z.object({
    created: z.string().datetime(),
    updated: z.string().datetime(),
    domain: z.string(),
    name: z.string(),
  }),
);

export type Tailorctl = {
  sync: () => Promise<number>;
  tidy: () => Promise<number>;
  apps: () => Promise<z.infer<typeof appsSchema>>;
  apply: (env: string, cb?: RunningCallbacks) => Promise<number>;
  destroy: () => Promise<number>;
  createWorkspace: (name: string, cb?: RunningCallbacks) => Promise<number>;
  createVault: () => Promise<number>;
};

const v2minitailorEnv = {
  APP_HTTP_SCHEMA: "http",
  PLATFORM_URL: "http://mini.tailor.tech:18090",
  TAILOR_TOKEN: "tpp_11111111111111111111111111111111",
};

const config = getConfig();
export const cliTailorctlAdapter: Tailorctl = {
  sync: () => spawnExecutable(tailorctlBinary, ["cue", "sync"]),
  tidy: () => spawnExecutable(tailorctlBinary, ["alpha", "manifest", "tidy"]),
  apps: () =>
    new Promise(async (resolve, reject) => {
      await spawnExecutable(
        tailorctlBinary,
        ["alpha", "workspace", "app", "list", "--format", "json"],
        {
          onStdoutReceived: (msg) => {
            const result = appsSchema.safeParse(JSON.parse(msg));
            if (result.success) {
              resolve(result.data);
            } else {
              reject(
                new SpawnProcessError(null, [
                  "invalid apps",
                  fromZodError(result.error).toString(),
                ]),
              );
            }
          },
        },
        { env: v2minitailorEnv },
      );
    }),
  apply: (env, cb) =>
    spawnExecutable(
      tailorctlBinary,
      [
        "alpha",
        "workspace",
        "apply",
        "--auto-approve",
        "--envs",
        env,
        "-m",
        path.join(config?.manifest || "", config?.target[0] || ""),
      ],
      {
        onStdoutReceived: (msg) => cb?.onRunning && cb.onRunning(msg),
      },
      { env: v2minitailorEnv },
    ),
  destroy: () =>
    spawnExecutable(
      tailorctlBinary,
      ["alpha", "workspace", "destroy", "--auto-approve"],
      {},
      { env: v2minitailorEnv },
    ),
  createWorkspace: (name, cb) =>
    spawnExecutable(
      tailorctlBinary,
      ["alpha", "workspace", "create", "--name", name],
      {
        onStdoutReceived: (msg) => cb?.onRunning && cb.onRunning(msg),
      },
      { env: v2minitailorEnv },
    ),
  createVault: () =>
    spawnExecutable(
      tailorctlBinary,
      ["alpha", "vault", "create", "--name", "default"],
      {},
      { env: v2minitailorEnv },
    ),
};
