import { spawnExecutable, tailorctlBinary } from "../support/process.js";

type RunningCallbacks = {
  onRunning?: (msg: string) => void;
};

export type Tailorctl = {
  sync: () => Promise<number>;
  tidy: () => Promise<number>;
  apply: (cb?: RunningCallbacks) => Promise<number>;
  destroy: () => Promise<number>;
  createWorkspace: (name: string, cb?: RunningCallbacks) => Promise<number>;
  createVault: () => Promise<number>;
};

const minitailorEnv = {
  APP_HTTP_SCHEMA: "http",
  PLATFORM_URL: "http://mini.tailor.tech:18090",
  TAILOR_TOKEN: "tpp_11111111111111111111111111111111",
};

export const cliTailorctlAdapter: Tailorctl = {
  sync: () => spawnExecutable(tailorctlBinary, ["cue", "sync"]),
  tidy: () => spawnExecutable(tailorctlBinary, ["alpha", "manifest", "tidy"]),
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
      { env: minitailorEnv },
    ),
  destroy: () =>
    spawnExecutable(
      tailorctlBinary,
      ["alpha", "workspace", "destroy", "--auto-approve"],
      {},
      { env: minitailorEnv },
    ),
  createWorkspace: (name, cb) =>
    spawnExecutable(
      tailorctlBinary,
      ["alpha", "workspace", "create", "--name", name],
      {
        onStdoutReceived: (msg) => cb?.onRunning && cb.onRunning(msg),
      },
      { env: minitailorEnv },
    ),
  createVault: () =>
    spawnExecutable(
      tailorctlBinary,
      ["alpha", "vault", "create", "--name", "default"],
      {},
      { env: minitailorEnv },
    ),
};
