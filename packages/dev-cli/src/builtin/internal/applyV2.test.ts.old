import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { buildMockConfig, buildMockDeps, oraMock } from "../../tests/mock.js";
import { applyCmd } from "./apply.js";
import { NoTargetFileError } from "../v1/apply.js";

vi.mock("ora", () => ({
  default: () => oraMock(),
}));

describe("apply usecase", () => {
  const mockConfig = buildMockConfig();
  const mockDeps = buildMockDeps();
  const runApplyCmd = applyCmd(mockDeps);

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    // vi.resetAllMocks();
    vi.restoreAllMocks();
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
    expect(mockDeps.tailorctl.tidy).not.toHaveBeenCalled();
    expect(mockDeps.cuelang.vet).not.toHaveBeenCalled();
    expect(mockDeps.cuelang.eval).not.toHaveBeenCalled();
    expect(mockDeps.resource.copyCueMod).not.toHaveBeenCalled();
    expect(mockDeps.dockerCompose.apply).not.toHaveBeenCalledOnce();
    expect(mockDeps.tailorctl.apply).not.toHaveBeenCalled();
    expect(errorLog).toHaveBeenCalledWith(
      expect.stringContaining(NoTargetFileError.message),
    );
  });

  test("one target file", async () => {
    vi.spyOn(console, "info").mockImplementation(() => void 0);
    vi.runAllTimers();

    await runApplyCmd(
      {
        env: "local",
        onlyEval: false,
      },
      mockConfig,
    );

    expect(mockDeps.tailorctl.sync).not.toHaveBeenCalledOnce();
    expect(mockDeps.tailorctl.tidy).toHaveBeenCalled();
    expect(mockDeps.cuelang.vet).toHaveBeenCalledOnce();
    expect(mockDeps.cuelang.eval).toHaveBeenCalledOnce();
    expect(mockDeps.resource.copyCueMod).toHaveBeenCalledOnce();
    expect(mockDeps.dockerCompose.apply).not.toHaveBeenCalledOnce();
    expect(mockDeps.tailorctl.createWorkspace).toHaveBeenCalled();
    expect(mockDeps.tailorctl.createVault).toHaveBeenCalled();
    expect(mockDeps.tailorctl.apply).toHaveBeenCalled();
  });

  test("multiple target files", async () => {
    vi.spyOn(console, "info").mockImplementation(() => void 0);
    vi.runAllTimers();

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

    expect(mockDeps.tailorctl.sync).not.toHaveBeenCalledOnce();
    expect(mockDeps.tailorctl.tidy).toHaveBeenCalled();
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
    expect(mockDeps.dockerCompose.apply).not.toHaveBeenCalledOnce();
    expect(mockDeps.tailorctl.createWorkspace).toHaveBeenCalled();
    expect(mockDeps.tailorctl.createVault).toHaveBeenCalled();
    expect(mockDeps.tailorctl.apply).toHaveBeenCalled();
  });
});
