import { LevelledLogger, LogLevel } from "@cli/logger.js";

export class TerminalLogger {
  private readonly logger: LevelledLogger;

  constructor(logger: LevelledLogger) {
    this.logger = logger;
    this.logger.setLevel(
      (process.env.__TAILORDEV_LOGLEVEL as LogLevel) || "info",
    );
  }

  error(prefix: string, msg?: unknown, ...params: unknown[]) {
    this.logger.error(prefix, msg, ...params);
  }

  info(prefix: string, msg?: unknown, ...params: unknown[]) {
    this.logger.info(prefix, msg, ...params);
  }

  debug(prefix: string, msg?: unknown, ...params: unknown[]) {
    this.logger.debug(prefix, msg, ...params);
  }

  async group(prefix: string, description: string, cb: () => Promise<void>) {
    this.info(prefix, `${description} running...`);
    await cb();
    this.info(prefix, `${description} finished`);
  }

  infoWithoutPrefix(msg: string) {
    this.logger.infoWithoutPrefix(msg);
  }
}
