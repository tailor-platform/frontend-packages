import { TerminalLogger } from "../cli/support/logger.js";
import { cuelangBinary, tailorctlBinary } from "../cli/support/process.js";
import * as execa from "execa";

const defaultStdio: execa.Options["stdio"] = "inherit";

export const tailorctl = (args: string[], opts: execa.Options = {}) =>
  $({
    stdio: defaultStdio,
    ...opts,
  })`${tailorctlBinary()} ${args}`;
export const cue = (args: string[], opts: execa.Options = {}) =>
  $({
    stdio: defaultStdio,
    ...opts,
  })`${cuelangBinary()} ${args}`;
export const dockerCompose = (args: string[], opts: execa.Options = {}) =>
  execa.$({
    stdio: defaultStdio,
    ...opts,
  })`docker compose ${args}`;
export const log = new TerminalLogger();
export const $ = execa.$;
export { getConfig } from "../cli/support/config.js";
