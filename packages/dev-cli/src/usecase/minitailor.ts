import { handleError } from "../support/error.js";
import { buildUsecase } from "../support/usecase.js";
import { terminal } from "../support/logger.js";

export type MinitailorRunOpts = {
  paths: string[];
  host: string;
};

export const importCmd = buildUsecase<MinitailorRunOpts>(
  async ({ dockerCompose, args }) => {
    try {
      for (const path of args.paths) {
        await dockerCompose.import(path, args.host, {
          onRunning: (msg) => {
            terminal.info("minitailor", msg);
          },
        });
      }
    } catch (e: unknown) {
      handleError("minitailor", e);
    }
  },
);
