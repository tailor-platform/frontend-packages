import { afterEach, describe, expect, test, vi } from "vitest";
import { buildMockConfig, buildMockDeps, oraMock } from "../../tests/mock.js";
import { NoTargetFileError, applyCmd } from "./apply.js";

vi.mock("ora", () => ({
  default: () => oraMock(),
}));

describe("apply usecase", () => {
  const mockConfig = buildMockConfig();
  const mockDeps = buildMockDeps();
  const runApplyCmd = applyCmd(mockDeps);

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("no target file", async () => {
    const errorLog = vi
      .spyOn(console, "error")
      .mockImplementation(() => void 0);

    const emptyTargetMockConfig = buildMockConfig({
      target: [],
    });

    await runApplyCmd(
      {
        env: "local",
        onlyEval: false,
      },
      emptyTargetMockConfig,
    );

    expect(mockDeps.tailorctl.sync).not.toHaveBeenCalled();
    expect(mockDeps.cuelang.vet).not.toHaveBeenCalled();
    expect(mockDeps.cuelang.eval).not.toHaveBeenCalled();
    expect(mockDeps.resource.copyCueMod).not.toHaveBeenCalled();
    expect(mockDeps.dockerCompose.apply).not.toHaveBeenCalled();
    expect(errorLog).toHaveBeenCalledWith(
      expect.stringContaining(NoTargetFileError.message),
    );
  });

  test("one target file", async () => {
    vi.spyOn(console, "info").mockImplementation(() => void 0);

    await runApplyCmd(
      {
        env: "local",
        onlyEval: false,
      },
      mockConfig,
    );

    expect(mockDeps.tailorctl.sync).toHaveBeenCalledOnce();
    expect(mockDeps.cuelang.vet).toHaveBeenCalledOnce();
    expect(mockDeps.cuelang.eval).toHaveBeenCalledOnce();
    expect(mockDeps.resource.copyCueMod).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.apply).toHaveBeenCalledOnce();
  });

  test("multiple target files", async () => {
    vi.spyOn(console, "info").mockImplementation(() => void 0);

    const multipleTargetMockConfig = buildMockConfig({
      target: ["tailordb.cue", "pipeline.cue", "stateflow.cue"],
    });

    await runApplyCmd(
      {
        env: "local",
        onlyEval: false,
      },
      multipleTargetMockConfig,
    );

    expect(mockDeps.tailorctl.sync).toHaveBeenCalledOnce();
    expect(mockDeps.cuelang.vet).toHaveBeenCalledTimes(3);
    expect(mockDeps.cuelang.eval).toHaveBeenCalledTimes(3);
    expect(mockDeps.cuelang.eval).toHaveBeenNthCalledWith(
      1,
      "local",
      "tailordb.cue",
    );
    expect(mockDeps.cuelang.eval).toHaveBeenNthCalledWith(
      2,
      "local",
      "pipeline.cue",
    );
    expect(mockDeps.cuelang.eval).toHaveBeenNthCalledWith(
      3,
      "local",
      "stateflow.cue",
    );
    expect(mockDeps.resource.copyCueMod).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.apply).toHaveBeenCalledOnce();
  });

  test("--only-eval enabled", async () => {
    vi.spyOn(console, "info").mockImplementation(() => void 0);

    await runApplyCmd(
      {
        env: "local",
        onlyEval: true,
      },
      mockConfig,
    );

    expect(mockDeps.tailorctl.sync).toHaveBeenCalledOnce();
    expect(mockDeps.cuelang.vet).toHaveBeenCalledOnce();
    expect(mockDeps.cuelang.eval).toHaveBeenCalledOnce();
    expect(mockDeps.resource.copyCueMod).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.apply).not.toHaveBeenCalled();
  });
});
