import { spawnExecutable, tailorctlBinary } from "../support/process.js";
import { z } from "zod";

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
  apply: (cb?: RunningCallbacks) => Promise<number>;
  destroy: () => Promise<number>;
  createWorkspace: (name: string, cb?: RunningCallbacks) => Promise<number>;
  createVault: () => Promise<number>;
};

const v2minitailorEnv = {
  APP_HTTP_SCHEMA: "http",
  PLATFORM_URL: "http://mini.tailor.tech:18090",
  TAILOR_TOKEN: "tpp_11111111111111111111111111111111",
};

export const cliTailorctlAdapter: Tailorctl = {
  sync: () => spawnExecutable(tailorctlBinary, ["cue", "sync"]),
  tidy: () => spawnExecutable(tailorctlBinary, ["alpha", "manifest", "tidy"]),
  apps: () =>
    new Promise(async (resolve) => {
      await spawnExecutable(
        tailorctlBinary,
        ["alpha", "workspace", "app", "list", "--format", "json"],
        {
          onStdoutReceived: (msg) => {
            resolve(appsSchema.parse(JSON.parse(msg)));
          },
        },
        { env: v2minitailorEnv },
      );
    }),
  apply: (cb) =>
    spawnExecutable(
      tailorctlBinary,
      [
        "alpha",
        "workspace",
        "apply",
        "--auto-approve",
        "-m",
        ".tailordev/generated",
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
