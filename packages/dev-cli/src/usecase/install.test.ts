import { vi, expect, test } from "vitest";
import { buildMockConfig, buildMockDeps, oraMock } from "../tests/mock.js";
import { installCmd } from "./install.js";

vi.mock("ora", () => ({
  default: () => oraMock(),
}));

test("install usecase", async () => {
  const mockConfig = buildMockConfig();
  const mockDeps = buildMockDeps();
  const runInstallCmd = installCmd(mockDeps);

  await runInstallCmd(
    {
      tailorctlVersion: "v9.9.1",
      cuelangVersion: "v9.9.2",
    },
    mockConfig
  );

  expect(mockDeps.deptools.downloadTailorctl).toHaveBeenCalledWith(
    "v9.9.1",
    undefined
  );
  expect(mockDeps.deptools.downloadCuelang).toHaveBeenCalledWith(
    "v9.9.2",
    undefined
  );
});
