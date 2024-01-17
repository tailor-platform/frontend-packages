import { afterEach, describe, expect, test, vi } from "vitest";
import { buildMockConfig, buildMockDeps, oraMock } from "../tests/mock.js";
import { startCmd } from "./start.js";

vi.mock("ora", () => ({
  default: () => oraMock(),
}));

describe("start usecase", () => {
  const mockConfig = buildMockConfig();
  const mockDeps = buildMockDeps();
  const runStartCmd = startCmd(mockDeps);

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("with --apply option (v1)", async () => {
    vi.spyOn(console, "log").mockImplementation(() => void 0);

    await runStartCmd(
      {
        env: "local",
        apply: true,
        onlyFile: false,
      },
      mockConfig,
    );

    expect(mockDeps.resource.createEmptyLogFile).toHaveBeenCalledOnce();
    expect(mockDeps.resource.createComposeConfig).toHaveBeenCalledOnce();
    expect(mockDeps.resource.createInitSQL).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.up).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.apply).toHaveBeenCalledOnce();
    expect(mockDeps.tailorctl.createWorkspace).not.toHaveBeenCalled();
    expect(mockDeps.tailorctl.createVault).not.toHaveBeenCalled();
    expect(mockDeps.tailorctl.apply).not.toHaveBeenCalled();
  });

  test("with --apply option (v2)", async () => {
    vi.spyOn(console, "log").mockImplementation(() => void 0);

    await runStartCmd(
      {
        env: "local",
        apply: true,
        onlyFile: false,
      },
      {
        ...mockConfig,
        version: "v2",
      },
    );

    expect(mockDeps.resource.createEmptyLogFile).toHaveBeenCalledOnce();
    expect(mockDeps.resource.createComposeConfig).toHaveBeenCalledOnce();
    expect(mockDeps.resource.createInitSQL).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.up).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.apply).not.toHaveBeenCalledOnce();
    expect(mockDeps.tailorctl.createWorkspace).toHaveBeenCalled();
    expect(mockDeps.tailorctl.createVault).toHaveBeenCalled();
    expect(mockDeps.tailorctl.apply).toHaveBeenCalled();
  });

  test("without --apply option", async () => {
    vi.spyOn(console, "log").mockImplementation(() => void 0);

    await runStartCmd(
      {
        env: "local",
        apply: false,
        onlyFile: false,
      },
      mockConfig,
    );

    expect(mockDeps.resource.createEmptyLogFile).toHaveBeenCalledOnce();
    expect(mockDeps.resource.createComposeConfig).toHaveBeenCalledOnce();
    expect(mockDeps.resource.createInitSQL).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.up).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.apply).not.toHaveBeenCalledOnce();
  });

  test("with --only-file option", async () => {
    vi.spyOn(console, "log").mockImplementation(() => void 0);

    await runStartCmd(
      {
        env: "local",
        apply: false,
        onlyFile: true,
      },
      mockConfig,
    );

    expect(mockDeps.resource.createEmptyLogFile).toHaveBeenCalledOnce();
    expect(mockDeps.resource.createComposeConfig).toHaveBeenCalledOnce();
    expect(mockDeps.resource.createInitSQL).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.up).not.toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.apply).not.toHaveBeenCalledOnce();
  });

  test("--apply with --only-file option has no effect", async () => {
    vi.spyOn(console, "log").mockImplementation(() => void 0);

    await runStartCmd(
      {
        env: "local",
        apply: true,
        onlyFile: true,
      },
      mockConfig,
    );

    expect(mockDeps.resource.createEmptyLogFile).toHaveBeenCalledOnce();
    expect(mockDeps.resource.createComposeConfig).toHaveBeenCalledOnce();
    expect(mockDeps.resource.createInitSQL).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.up).not.toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.apply).not.toHaveBeenCalledOnce();
  });
});
