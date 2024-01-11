import os from "node:os";
import { rm } from "fs/promises";
import { tailorctlDir, cuelangDir, destDir } from "../support/process.js";
import * as GithubRelease from "gh-release-fetch";

export type Deptools = {
  deleteAll: () => Promise<void>;
  downloadTailorctl: (version: string) => {
    packageName: string;
    promise: Promise<void>;
  };
  downloadCuelang: (version: string) => {
    packageName: string;
    promise: Promise<void>;
  };
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
  // Cuelang release uses amd64 as a name prefix so replace here with it...
  const _arch = arch === "x86_64" ? "amd64" : arch;
  return `cue_${version}_${type}_${_arch}.tar.gz`;
};

export const cliDeptoolsAdapter: Deptools = {
  deleteAll: () =>
    rm(destDir, {
      recursive: true,
      force: true,
    }),
  downloadTailorctl: (version: string) => ({
    packageName: buildTailorctlPackageName(version),
    promise: GithubRelease.fetchVersion({
      repository: "tailor-platform/tailorctl",
      package: buildTailorctlPackageName(version),
      destination: tailorctlDir,
      version,
      extract: true,
    }),
  }),
  downloadCuelang: (version: string) => ({
    packageName: buildCuelangPackageName(version),
    promise: GithubRelease.fetchVersion({
      repository: "cue-lang/cue",
      package: buildCuelangPackageName(version),
      destination: cuelangDir,
      version,
      extract: true,
    }),
  }),
};