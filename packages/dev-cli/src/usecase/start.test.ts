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

  test("with --apply option", async () => {
    vi.spyOn(console, "log").mockImplementation(() => void 0);

    await runStartCmd(
      {
        env: "local",
        apply: true,
        onlyEval: false,
      },
      mockConfig
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
        onlyEval: false,
      },
      mockConfig
    );

    expect(mockDeps.resource.createEmptyLogFile).toHaveBeenCalledOnce();
    expect(mockDeps.resource.createComposeConfig).toHaveBeenCalledOnce();
    expect(mockDeps.resource.createInitSQL).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.upAll).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.apply).not.toHaveBeenCalledOnce();
  });
});
