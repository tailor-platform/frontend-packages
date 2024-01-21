import { cwd } from "process";
import * as execa from "execa";
import { composePath } from "@builtin/internal/resource.js";
import { defaultProfileName } from "@builtin/templates/compose.yaml.js";
import { getConfig } from "@cli/support/config.js";
import path from "path";
import { cuelangDir, tailorctlDir } from "@cli/interfaces/deptools.js";

const config = getConfig();
const defaultStdio: execa.Options = {
  stdio: "inherit",
};
const cuelangPath = path.join(cuelangDir, "cue");
const tailorctlPath = path.join(tailorctlDir, "tailorctl");

export const tailorctl = (args: string[], opts: execa.Options = {}) =>
  execa.$({
    ...defaultStdio,
    ...opts,
  })`${tailorctlPath} ${args}`;
export const cue = (args: string[], opts: execa.Options = {}) =>
  execa.$({
    ...defaultStdio,
    ...opts,
  })`${cuelangPath} ${args}`;
export const dockerCompose = (args: string[], opts: execa.Options = {}) =>
  execa.$({
    ...defaultStdio,
    ...opts,
  })`docker compose ${[
    "-f",
    composePath,
    "--profile",
    defaultProfileName,
    "--project-directory",
    cwd(),
    "-p",
    config?.name || "",
  ]} ${args}`;
