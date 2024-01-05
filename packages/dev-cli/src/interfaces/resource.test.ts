import { describe, expect, test, vi } from "vitest";
import { cliResourceAdapter } from "./resource.js";
import { Volume } from "memfs/lib/volume.js";

const vol = new Volume();
const initialDirectory = {
  // "/home/test/cue.mod": null,
  "/home/test/cue.mod/module.cue": "this is module.cue",
};

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

describe("resource", () => {
  test("createGeneratedDist", async () => {
    await cliResourceAdapter.createGeneratedDist();

    expect(vol.toJSON()).toStrictEqual(
      expect.objectContaining({
        "/home/test/.tailordev/generated": null,
      })
    );
  });

  test("createComposeConfig", async () => {
    await cliResourceAdapter.createComposeConfig("this is compose content");

    expect(vol.toJSON()).toStrictEqual(
      expect.objectContaining({
        "/home/test/.tailordev/compose.yaml": "this is compose content",
      })
    );
  });

  test("createInitSQL", async () => {
    await cliResourceAdapter.createInitSQL("this is init SQL content");

    expect(vol.toJSON()).toStrictEqual(
      expect.objectContaining({
        "/home/test/.tailordev/db/init/0-minitailor-database.sql":
          "this is init SQL content",
      })
    );
  });

  test("existsComposeConfig", async () => {
    const result1 = await cliResourceAdapter.existsComposeConfig();
    expect(result1).toBeTruthy();

    await vol.promises.rm("/home/test/.tailordev/compose.yaml");
    const result2 = await cliResourceAdapter.existsComposeConfig();
    expect(result2).toBeFalsy();
  });

  test.skip("copyCueMod", async () => {
    // NOTE: memfs does not implement `cp` so skip this case intentionally
  });

  test("deleteAll", async () => {
    await cliResourceAdapter.deleteAll();

    expect(vol.toJSON()).toStrictEqual(initialDirectory);
  });
});
