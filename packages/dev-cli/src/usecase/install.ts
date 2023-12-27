import ora from "ora";
import { tailorctlDir, cuelangDir } from "../support/process.js";
import { printError } from "../support/error.js";

type InstallOpts = {
  ghToken?: string;
  tailorctlVersion: string;
  cuelangVersion: string;
};

export const installCmd = async (opts: InstallOpts) => {
  const { fetchLatest } = await import("gh-release-fetch");
  const downloadTailorctlSpinner = ora();
  const downloadCuelangSpinner = ora();

  try {
    const headers = {
      authorization: opts.ghToken ? `bearer ${opts.ghToken}` : "",
    };

    const downloadTailorctl = async () => {
      const packageName = `tailorctl_darwin_${opts.tailorctlVersion}_arm64.tar.gz`;
      downloadTailorctlSpinner.start(`Downloading ${packageName}`);
      return fetchLatest(
        {
          repository: "tailor-platform/tailorctl",
          package: `tailorctl_darwin_${opts.tailorctlVersion}_arm64.tar.gz`,
          destination: tailorctlDir,
          version: opts.tailorctlVersion,
          extract: true,
        },
        { headers }
      )
        .then(() => downloadTailorctlSpinner.succeed())
        .catch(() => downloadTailorctlSpinner.fail());
    };

    const downloadCuelang = async () => {
      const packageName = `cue_${opts.cuelangVersion}_darwin_arm64.tar.gz`;
      downloadCuelangSpinner.start(`Downloading ${packageName}`);
      return fetchLatest(
        {
          repository: "cue-lang/cue",
          package: packageName,
          destination: cuelangDir,
          version: opts.cuelangVersion,
          extract: true,
        },
        { headers }
      )
        .then(() => downloadCuelangSpinner.succeed())
        .catch(() => downloadCuelangSpinner.fail());
    };

    await Promise.all([downloadTailorctl(), downloadCuelang()]);
  } catch (e) {
    printError(e);
  }
};
