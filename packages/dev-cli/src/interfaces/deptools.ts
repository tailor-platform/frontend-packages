import os from "node:os";
import { rm } from "fs/promises";
import { tailorctlDir, cuelangDir, destDir } from "../support/process.js";
import * as GithubRelease from "gh-release-fetch";

export type Deptools = {
  deleteAll: () => Promise<void>;
  downloadTailorctl: (
    version: string,
    ghToken?: string,
  ) => { packageName: string; promise: Promise<void> };
  downloadCuelang: (
    version: string,
    ghToken?: string,
  ) => { packageName: string; promise: Promise<void> };
};

const normalizeOSInfo = () => {
  const osType = os.type();
  const osArch = os.arch();

  return {
    type: (() => {
      if (osType === "Linux" || osType === "Darwin")
        return osType.toLowerCase();
      else throw new Error("Unsupported OS type");
    })(),
    arch: (() => {
      if (osArch === "arm64") return osArch;
      else if (osArch === "x64") return "x86_64";
      else throw new Error("Unsupported OS architecture");
    })(),
  };
};

const buildTailorctlPackageName = (version: string) => {
  const { type, arch } = normalizeOSInfo();
  return `tailorctl_${type}_${version}_${arch}.tar.gz`;
};
const buildCuelangPackageName = (version: string) => {
  const { type, arch } = normalizeOSInfo();
  return `cue_${version}_${type}_${arch}.tar.gz`;
};
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
      },
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
      { headers: buildHeaders(ghToken) },
    ),
  }),
};
