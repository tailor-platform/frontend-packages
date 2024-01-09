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
          args.ghToken,
        );
        downloadTailorctlSpinner.start(`Downloading ${packageName}`);
        return promise
          .then(() => downloadTailorctlSpinner.succeed())
          .catch(() => downloadTailorctlSpinner.fail());
      };

      const downloadCuelang = async () => {
        const { packageName, promise } = deptools.downloadCuelang(
          args.cuelangVersion,
          args.ghToken,
        );
        downloadCuelangSpinner.start(`Downloading ${packageName}`);
        return promise
          .then(() => downloadCuelangSpinner.succeed())
          .catch(() => downloadCuelangSpinner.fail());
      };

      await Promise.all([downloadTailorctl(), downloadCuelang()]);
    } catch (e) {
      printError(e);
    }
  },
);
