import { stat, rm, mkdir, cp, writeFile } from "fs/promises";
import path from "path";

export type Resource = {
  deleteAll: () => Promise<void>;
  existsComposeConfig: () => Promise<string | undefined>;
  copyCueMod: () => Promise<void>;
  createGeneratedDist: () => Promise<void>;
  createComposeConfig: (content: string) => Promise<string>;
  createInitSQL: (content: string) => Promise<void>;
};

const resourcePath = path.join(".", ".tailordev");
export const generatedPath = path.join(resourcePath, "generated");
export const composePath = path.join(resourcePath, "compose.yaml");
export const cliResourceAdapter: Resource = {
  deleteAll: () =>
    rm(resourcePath, {
      recursive: true,
      force: true,
    }),
  existsComposeConfig: () =>
    stat(composePath)
      .then(() => composePath)
      .catch(() => undefined),
  copyCueMod: () =>
    cp(path.join(".", "cue.mod"), path.join(resourcePath, "cue.mod"), {
      recursive: true,
    }),
  createGeneratedDist: async () => await mkdirIfNothing(generatedPath),
  createComposeConfig: async (content) => {
    await mkdirIfNothing(resourcePath);
    await writeFile(composePath, content.trim());
    return composePath;
  },
  createInitSQL: async (content) => {
    const dbinitDir = path.join(resourcePath, "db", "init");
    await mkdirIfNothing(dbinitDir);
    await writeFile(
      path.join(dbinitDir, "0-minitailor-database.sql"),
      content.trim()
    );
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
  }
};
