import chalk from "chalk";
import { randomUUID } from "crypto";
import ora, { Ora } from "ora";

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

class TerminalLogger implements Logger {
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
      this.logger.error(
        `${chalk.bold.red(`[${prefix}]`)} ${msg}`,
        params.length > 0 ? params : undefined,
      );
    });
  }

  info(prefix: string, msg?: unknown, ...params: unknown[]) {
    if (logLevels[this.level] > logLevels.info) {
      return;
    }
    this.withRerenderSpinners(() => {
      this.logger.info(
        `${chalk.bold.yellow(`[${prefix}]`)} ${msg}`,
        params.length > 0 ? params : undefined,
      );
    });
  }

  debug(prefix: string, msg?: unknown, ...params: unknown[]) {
    if (logLevels[this.level] > logLevels.debug) {
      return;
    }
    this.withRerenderSpinners(() => {
      this.logger.debug(
        `${chalk.bold.white(`[${prefix}]`)} ${chalk.white(msg)}`,
        params.length > 0 ? params : undefined,
      );
    });
  }

  spinner(msg?: string) {
    const spinner = ora(msg);
    const id = randomUUID();
    this.spinners.set(id, spinner);

    return {
      start: (text?: string) => {
        return spinner.start(text);
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
