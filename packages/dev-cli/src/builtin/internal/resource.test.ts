import { afterEach, describe, expect, test, vi } from "vitest";
import { fileIO, composePath } from "./resource.js";
import { Volume } from "memfs/lib/volume.js";
import { composeYaml } from "@builtin/templates/compose.yaml.js";
import { minitailorInitSQL } from "@builtin/templates/0-minitailor-database.sql.js";

const initialDirectory = {
  "/home/test": null,
};
const vol = new Volume();
vol.fromJSON(initialDirectory);

vi.mock("fs/promises", () => {
  return {
    stat: vi.fn((path) => vol.promises.stat(path)),
    rm: vi.fn((path, options) => vol.promises.rm(path, options)),
    mkdir: vi.fn((path, options) => vol.promises.mkdir(path, options)),
    cp: vi.fn((src, dest) => vol.promises.cp(src, dest)),
    writeFile: vi.fn((path, content) => vol.promises.writeFile(path, content)),
  };
});

vi.mock("node:process", () => {
  return {
    cwd: vi.fn(() => "/home/test"),
  };
});

vi.mock("@script/index.js", () => {
  return {
    log: {
      debug: vi.fn(),
    },
  };
});

describe("resource", () => {
  afterEach(() => {
    vol.reset();
    vol.fromJSON(initialDirectory);
  });

  test("createGeneratedDist", async () => {
    await fileIO.createGeneratedDist();

    expect(vol.toJSON()).toStrictEqual(
      expect.objectContaining({
        "/home/test/.tailordev/generated": null,
      }),
    );
  });

  test("createComposeConfig", async () => {
    await fileIO.createComposeConfig();

    expect(vol.toJSON()).toStrictEqual(
      expect.objectContaining({
        "/home/test/.tailordev/compose.yaml": composeYaml().trim(),
      }),
    );
  });

  test("createInitSQL", async () => {
    await fileIO.createInitSQL();

    expect(vol.toJSON()).toStrictEqual(
      expect.objectContaining({
        "/home/test/.tailordev/db/init/0-minitailor-database.sql":
          minitailorInitSQL.trim(),
      }),
    );
  });

  test("createEmptyLogFile", async () => {
    await fileIO.createEmptyLogFile();

    expect(vol.toJSON()).toStrictEqual(
      expect.objectContaining({
        "/home/test/.tailordev/minitailor.log": "",
      }),
    );
  });

  test("existsComposeConfig", async () => {
    await fileIO.createComposeConfig();
    const result1 = await fileIO.existsComposeConfig();
    expect(result1).toBe(composePath);

    await vol.promises.rm("/home/test/.tailordev/compose.yaml");
    const result2 = await fileIO.existsComposeConfig();
    expect(result2).toBeFalsy();
  });

  test.skip("copyCueMod", async () => {
    // NOTE: memfs does not implement `cp` so skip this case intentionally
  });

  test("deleteAll", async () => {
    await fileIO.deleteAll();

    expect(vol.toJSON()).toStrictEqual({
      "/home/test": null,
    });
  });
});
