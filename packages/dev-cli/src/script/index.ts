import * as execa from "execa";
import { TerminalLogger } from "@script/logger.js";

export const $ = execa.$;
export const log = new TerminalLogger();
export { tailorctl, cue, dockerCompose } from "./helper.js";
export { getConfig } from "@cli/config.js";
