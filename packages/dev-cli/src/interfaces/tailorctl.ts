import { spawnExecutable, tailorctlBinary } from "../support/process.js";

export type Tailorctl = {
  sync: () => Promise<number>;
  tidy: () => Promise<number>;
  apply: (manifest: string) => Promise<number>;
  destroy: () => Promise<number>;
  createWorkspace: (name: string) => Promise<number>;
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
  apply: (manifest: string) =>
    spawnExecutable(
      tailorctlBinary,
      ["alpha", "workspace", "apply", "-m", manifest],
      {},
      { env: minitailorEnv },
    ),
  destroy: () =>
    spawnExecutable(
      tailorctlBinary,
      ["alpha", "workspace", "destroy", "--auto-approve"],
      {},
      { env: minitailorEnv },
    ),
  createWorkspace: (name: string) =>
    spawnExecutable(
      tailorctlBinary,
      ["alpha", "workspace", "create", "--name", name],
      {},
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
