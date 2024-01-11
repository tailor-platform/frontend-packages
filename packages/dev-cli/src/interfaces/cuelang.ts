import path from "path";
import { spawnExecutable, cuelangBinary } from "../support/process.js";
import { getConfig } from "../support/config.js";
import { generatedPath } from "./resource.js";

export type Cuelang = {
  vet: (env: string, input: string) => Promise<number>;
  eval: (env: string, input: string) => Promise<number>;
};

const config = getConfig();
export const cliCuelangAdapter: Cuelang = {
  vet: (env, file) =>
    spawnExecutable(cuelangBinary, [
      "vet",
      "-t",
      env,
      "-c",
      path.join(config?.config.manifest || "", file),
    ]),
  eval: (env, file) =>
    spawnExecutable(cuelangBinary, [
      "eval",
      "-f",
      "-t",
      env,
      path.join(config?.config.manifest || "", file),
      "-o",
      path.join(generatedPath, file),
    ]),
};
