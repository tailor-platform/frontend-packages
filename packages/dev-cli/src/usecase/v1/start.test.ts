import { afterEach, describe, expect, test, vi } from "vitest";
import { buildMockConfig, buildMockDeps, oraMock } from "../../tests/mock.js";
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

  test("with --apply option", async () => {
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
    expect(mockDeps.dockerCompose.upAll).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.apply).toHaveBeenCalledOnce();
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
    expect(mockDeps.dockerCompose.upAll).toHaveBeenCalledOnce();
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
    expect(mockDeps.dockerCompose.upAll).not.toHaveBeenCalledOnce();
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
    expect(mockDeps.dockerCompose.upAll).not.toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.apply).not.toHaveBeenCalledOnce();
  });
});
