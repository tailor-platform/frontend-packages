import { cwd } from "process";
import * as execa from "execa";
import { composePath } from "@builtin/internal/resource.js";
import { defaultDockerComposeOptions } from "@builtin/templates/compose.js";
import { getConfig } from "@cli/config.js";
import path from "path";
import { cuelangDir, tailorctlDir } from "@builtin/internal/deptools.js";

const config = getConfig();
const defaultStdio: execa.Options = {
  stdio: "inherit",
  shell: true,
};
export const cue = path.join(cuelangDir, "cue");
export const tailorctl = path.join(tailorctlDir, "tailorctl");
export const dockerCompose = `docker compose -f ${composePath} --profile ${
  defaultDockerComposeOptions.profile
} --project-directory ${cwd()} -p ${config?.name || ""}`;
export const minitailor = `${dockerCompose} exec minitailor minitailor`;
export const $$ = execa.$({
  ...defaultStdio,
});
