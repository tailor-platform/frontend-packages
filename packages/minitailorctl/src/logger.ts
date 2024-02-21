import chalk from "chalk";

export const logLevels = {
  debug: 0,
  info: 1,
  error: 2,
} as const;
export type LogLevel = keyof typeof logLevels;

export class LevelledLogger {
  private readonly logger: Console;
  private level: LogLevel;

  constructor() {
    this.logger = console;
    this.level = "info";
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }

  error(prefix: string, msg?: string, ...params: unknown[]) {
    if (logLevels[this.level] > logLevels.error) {
      return;
    }
    this.logger.error(`${chalk.bold.red(`[${prefix}]`)} ${msg}`, ...params);
  }

  info(prefix: string, msg?: string, ...params: unknown[]) {
    if (logLevels[this.level] > logLevels.info) {
      return;
    }
    this.logger.info(`${chalk.bold.white(`[${prefix}]`)} ${msg}`, ...params);
  }

  debug(prefix: string, msg?: string, ...params: unknown[]) {
    if (logLevels[this.level] > logLevels.debug) {
      return;
    }
    this.logger.debug(
      `${chalk.bold.white(`[${prefix}]`)} ${chalk.white(msg)}`,
      ...params,
    );
  }

  infoWithoutPrefix(msg: string, ...params: unknown[]) {
    if (logLevels[this.level] > logLevels.info) {
      return;
    }
    this.logger.info(msg, ...params);
  }
}
