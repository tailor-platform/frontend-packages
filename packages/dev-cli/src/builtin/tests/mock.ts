import { vi } from "vitest";
import { ConfigContent } from "@cli/config.js";
import { defaultDockerComposeOptions } from "@builtin/templates/compose.js";

export const buildMockConfig = (
  overrides?: Partial<ConfigContent>,
): ConfigContent => ({
  version: "v1",
  name: "mockapp",
  manifest: "manifest/config/template",
  target: ["tailordb.cue"],
  dockerCompose: defaultDockerComposeOptions,
  custom: {},
  application: "",
  machineUsername: "",
  ...overrides,
});

export const oraMock = (): unknown => ({
  start: vi.fn(() => oraMock()),
  fail: vi.fn(),
  succeed: vi.fn(),
  clear: vi.fn(),
  render: vi.fn(),
});
