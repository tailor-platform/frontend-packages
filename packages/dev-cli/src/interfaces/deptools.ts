import { rm } from "fs/promises";
import { tailorctlDir, cuelangDir, destDir } from "../support/process.js";
import * as GithubRelease from "gh-release-fetch";

export type Deptools = {
  deleteAll: () => Promise<void>;
  downloadTailorctl: (
    version: string,
    ghToken?: string
  ) => { packageName: string; promise: Promise<void> };
  downloadCuelang: (
    version: string,
    ghToken?: string
  ) => { packageName: string; promise: Promise<void> };
};

const buildTailorctlPackageName = (version: string) =>
  `tailorctl_darwin_${version}_arm64.tar.gz`;
const buildCuelangPackageName = (version: string) =>
  `cue_${version}_darwin_arm64.tar.gz`;
const buildHeaders = (token?: string) => ({
  authorization: token ? `bearer ${token}` : "",
});

export const cliDeptoolsAdapter: Deptools = {
  deleteAll: () =>
    rm(destDir, {
      recursive: true,
      force: true,
    }),
  downloadTailorctl: (version: string, ghToken?: string) => ({
    packageName: buildTailorctlPackageName(version),
    promise: GithubRelease.fetchLatest(
      {
        repository: "tailor-platform/tailorctl",
        package: buildTailorctlPackageName(version),
        destination: tailorctlDir,
        version,
        extract: true,
      },
      {
        headers: buildHeaders(ghToken),
      }
    ),
  }),
  downloadCuelang: (version: string, ghToken?: string) => ({
    packageName: buildCuelangPackageName(version),
    promise: GithubRelease.fetchLatest(
      {
        repository: "cue-lang/cue",
        package: buildCuelangPackageName(version),
        destination: cuelangDir,
        version,
        extract: true,
      },
      { headers: buildHeaders(ghToken) }
    ),
  }),
};
