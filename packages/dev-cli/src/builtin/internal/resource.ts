import { log } from "@script/index.js";
import { stat, rm, mkdir, cp, writeFile } from "fs/promises";
import { cwd } from "node:process";
import path from "path";

export type Resource = {
  deleteAll: () => Promise<void>;
  existsComposeConfig: () => Promise<string | null>;
  copyCueMod: () => Promise<void>;
  createGeneratedDist: () => Promise<void>;
  createComposeConfig: (content: string) => Promise<string>;
  createInitSQL: (content: string) => Promise<void>;
  createEmptyLogFile: () => Promise<void>;
};

const resourcePath = path.join(cwd(), ".tailordev");
export const generatedPath = path.join(resourcePath, "generated");
export const composePath = path.join(resourcePath, "compose.yaml");
export const fileIO: Resource = {
  deleteAll: async () => {
    await rm(resourcePath, {
      recursive: true,
      force: true,
    });
    log.debug("resource", `deleted: ${resourcePath}`);
  },
  existsComposeConfig: () =>
    stat(composePath)
      .then(() => composePath)
      .catch(() => null),
  copyCueMod: () => {
    const from = path.join(cwd(), "cue.mod");
    const to = path.join(resourcePath, "cue.mod");
    log.debug("resource", `copy (${from} -> ${to})`);
    return cp(from, to, {
      recursive: true,
    });
  },
  createGeneratedDist: async () => await mkdirIfNothing(generatedPath),
  createComposeConfig: async (content) => {
    await mkdirIfNothing(resourcePath);
    await writeFile(composePath, content.trim());
    log.debug("resource", `created file: ${composePath}`);
    return composePath;
  },
  createInitSQL: async (content) => {
    const dbinitDir = path.join(resourcePath, "db", "init");
    const file = path.join(dbinitDir, "0-minitailor-database.sql");
    await mkdirIfNothing(dbinitDir);
    await writeFile(file, content.trim());
    log.debug("resource", `created file: ${file}`);
  },
  createEmptyLogFile: async () => {
    const file = path.join(resourcePath, "minitailor.log");
    await mkdirIfNothing(resourcePath);
    await writeFile(file, "");
    log.debug("resource", `created file: ${file}`);
  },
};

const mkdirIfNothing = async (path: string) => {
  const exists = await stat(path)
    .then(() => true)
    .catch(() => false);

  if (!exists) {
    await mkdir(path, {
      recursive: true,
    });
    log.debug("resource", `created directory: ${path}`);
  }
};
