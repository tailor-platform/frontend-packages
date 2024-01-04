import { spawnExecutable, tailorctlBinary } from "../support/process.js";

export type Tailorctl = {
  sync: () => Promise<number>;
};

export const cliTailorctlAdapter: Tailorctl = {
  sync: () => spawnExecutable(tailorctlBinary, ["cue", "sync"]),
};
