import chalk from "chalk";
import { printError } from "../support/error.js";
import { buildUsecase } from "../support/usecase.js";

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
            console.log(`${chalk.bold.yellow("[minitailor]")} ${msg}`);
          },
        });
      }
    } catch (e: unknown) {
      if (e instanceof Object && "out" in e) {
        printError(e.out);
      } else {
        printError(e);
      }
    }
  },
);