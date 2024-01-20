import chalk from "chalk";
import { randomUUID } from "crypto";
import ora, { Ora } from "ora";

const logLevels = {
  debug: 0,
  info: 1,
  error: 2,
} as const;
type LogLevel = keyof typeof logLevels;

class TerminalLogger {
  private readonly logger: Console;
  private level: LogLevel;
  private spinners: Map<string, Ora>;

  constructor() {
    this.logger = console;
    this.level = "info";
    this.spinners = new Map();
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }

  error(prefix: string, msg?: unknown, ...params: unknown[]) {
    if (logLevels[this.level] > logLevels.error) {
      return;
    }
    this.withRerenderSpinners(() => {
      this.logger.error(`${chalk.bold.red(`[${prefix}]`)} ${msg}`, ...params);
    });
  }

  info(prefix: string, msg?: unknown, ...params: unknown[]) {
    if (logLevels[this.level] > logLevels.info) {
      return;
    }
    this.withRerenderSpinners(() => {
      this.logger.info(`${chalk.bold.yellow(`[${prefix}]`)} ${msg}`, ...params);
    });
  }

  debug(prefix: string, msg?: unknown, ...params: unknown[]) {
    if (logLevels[this.level] > logLevels.debug) {
      return;
    }
    this.withRerenderSpinners(() => {
      this.logger.debug(
        `${chalk.bold.white(`[${prefix}]`)} ${chalk.white(msg)}`,
        ...params,
      );
    });
  }

  infoWithoutPrefix(...msgs: string[]) {
    this.withRerenderSpinners(() => {
      this.logger.info(msgs.join("\n"));
    });
  }

  spinner(msg?: string) {
    const spinner = ora(msg);
    const id = randomUUID();
    const controller = {
      start: (text?: string) => {
        spinner.start(text);
        return controller;
      },
      succeed: (text?: string) => {
        this.spinners.delete(id);
        return spinner.succeed(text);
      },
      fail: (text?: string) => {
        this.spinners.delete(id);
        return spinner.fail(text);
      },
    };

    this.spinners.set(id, spinner);
    return controller;
  }

  // Ora needs clear() and render() around another STDOUT output
  // (Ref: https://github.com/sindresorhus/ora/issues/120#issuecomment-830563448)
  private withRerenderSpinners(cb: () => void) {
    this.spinners.forEach((s) => {
      s.clear();
    });
    cb();
    this.spinners.forEach((s) => {
      s.render();
    });
  }
}

export const terminal = new TerminalLogger();
