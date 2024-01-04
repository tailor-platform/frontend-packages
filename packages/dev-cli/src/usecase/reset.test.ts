import { afterEach, describe, expect, test, vi } from "vitest";
import { buildMockConfig, buildMockDeps, oraMock } from "../tests/mock.js";
import { resetCmd } from "./reset.js";

vi.mock("ora", () => ({
  default: () => oraMock(),
}));

describe("reset usecase", () => {
  const mockConfig = buildMockConfig();
  const mockDeps = buildMockDeps();
  const runResetCmd = resetCmd(mockDeps);

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("run with docker-compose.yaml", async () => {
    vi.spyOn(mockDeps.resource, "existsComposeConfig").mockImplementationOnce(
      () => Promise.resolve("compose.yml"),
    );

    await runResetCmd(null, mockConfig);

    expect(mockDeps.dockerCompose.down).toHaveBeenCalledOnce();
    expect(mockDeps.resource.deleteAll).toHaveBeenCalledOnce();
  });

  test("run without docker-compose.yaml", async () => {
    vi.spyOn(mockDeps.resource, "existsComposeConfig").mockImplementationOnce(
      () => Promise.resolve(undefined),
    );

    await runResetCmd(null, mockConfig);

    expect(mockDeps.dockerCompose.down).not.toHaveBeenCalledOnce();
    expect(mockDeps.resource.deleteAll).toHaveBeenCalledOnce();
  });
});
