import { TerminalLogger } from "@script/logger.js";
import { LevelledLogger } from "@cli/logger.js";

const baseLogger = new LevelledLogger();

export const log = new TerminalLogger(baseLogger);
export { $$, tailorctl, cue, dockerCompose } from "./helper.js";
export { getConfig } from "@cli/config.js";
