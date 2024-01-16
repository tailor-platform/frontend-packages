import { spawnExecutable, tailorctlBinary } from "../support/process.js";

export type Tailorctl = {
  sync: () => Promise<number>;
  tidy: () => Promise<number>;
  apply: (manifest: string) => Promise<number>;
  destroy: () => Promise<number>;
  createWorkspace: (name: string) => Promise<number>;
  createVault: () => Promise<number>;
};

export const cliTailorctlAdapter: Tailorctl = {
  sync: () => spawnExecutable(tailorctlBinary, ["cue", "sync"]),
  tidy: () => spawnExecutable(tailorctlBinary, ["alpha", "manifest", "tidy"]),
  apply: (manifest: string) =>
    spawnExecutable(tailorctlBinary, [
      "alpha",
      "workspace",
      "apply",
      "-m",
      manifest,
    ]),
  destroy: () =>
    spawnExecutable(tailorctlBinary, [
      "alpha",
      "workspace",
      "destroy",
      "--auto-approve",
    ]),
  createWorkspace: (name: string) =>
    spawnExecutable(tailorctlBinary, [
      "alpha",
      "workspace",
      "create",
      "--name",
      name,
    ]),
  createVault: () =>
    spawnExecutable(tailorctlBinary, [
      "alpha",
      "vault",
      "create",
      "--name",
      "default",
    ]),
};
