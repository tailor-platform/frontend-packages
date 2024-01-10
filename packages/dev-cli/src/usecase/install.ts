import ora from "ora";
import { printError } from "../support/error.js";
import { buildUsecase } from "../support/usecase.js";

type InstallOpts = {
  ghToken?: string;
  tailorctlVersion: string;
  cuelangVersion: string;
};

export const installCmd = buildUsecase<InstallOpts>(
  async ({ deptools, args }) => {
    const downloadTailorctlSpinner = ora();
    const downloadCuelangSpinner = ora();

    try {
      const downloadTailorctl = async () => {
        const { packageName, promise } = deptools.downloadTailorctl(
          args.tailorctlVersion,
        );
        downloadTailorctlSpinner.start(`Downloading ${packageName}`);
        return promise
          .then(() => downloadTailorctlSpinner.succeed())
          .catch((e) => {
            downloadTailorctlSpinner.fail();
            throw e;
          });
      };

      const downloadCuelang = async () => {
        const { packageName, promise } = deptools.downloadCuelang(
          args.cuelangVersion,
        );
        downloadCuelangSpinner.start(`Downloading ${packageName}`);
        return promise
          .then(() => downloadCuelangSpinner.succeed())
          .catch((e) => {
            downloadCuelangSpinner.fail();
            throw e;
          });
      };

      await Promise.all([downloadTailorctl(), downloadCuelang()]);
    } catch (e) {
      printError(e);
    }
  },
);
