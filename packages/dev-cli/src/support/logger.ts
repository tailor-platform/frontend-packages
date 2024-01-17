import chalk from "chalk";

type Logger = {
  debug: (prefix: string, msg?: unknown, ...params: unknown[]) => void;
  info: (prefix: string, msg?: unknown, ...params: unknown[]) => void;
  error: (prefix: string, msg?: unknown, ...params: unknown[]) => void;
  setLevel: (level: LogLevel) => void;
};

const logLevels = {
  debug: 0,
  info: 1,
  error: 2,
} as const;
type LogLevel = keyof typeof logLevels;

class ConsoleLogger {
  private readonly logger: Console;
  private level: LogLevel;

  constructor() {
    this.logger = console;
    this.level = "info";
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }

  error(prefix: string, msg?: unknown, ...params: unknown[]) {
    if (logLevels[this.level] > logLevels.error) {
      return;
    }
    this.logger.error(
      `${chalk.bold.red(`[${prefix}]`)} ${msg}`,
      params.length > 0 ? params : undefined,
    );
  }

  info(prefix: string, msg?: unknown, ...params: unknown[]) {
    if (logLevels[this.level] > logLevels.info) {
      return;
    }
    this.logger.info(
      `${chalk.bold.yellow(`[${prefix}]`)} ${msg}`,
      params.length > 0 ? params : undefined,
    );
  }

  debug(prefix: string, msg?: unknown, ...params: unknown[]) {
    if (logLevels[this.level] > logLevels.debug) {
      return;
    }
    this.logger.debug(
      `${chalk.bold.white(`[${prefix}]`)} ${chalk.white(msg)}`,
      params.length > 0 ? params : undefined,
    );
  }
}

export const logger: Logger = new ConsoleLogger();
