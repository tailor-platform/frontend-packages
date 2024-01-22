import { vi } from "vitest";
import { ConfigContent } from "../../cli/config.js";

export const buildMockConfig = (
  overrides?: Partial<ConfigContent>,
): ConfigContent => ({
  version: "v1",
  name: "mockapp",
  port: 8000,
  manifest: "manifest/config/template",
  target: ["tailordb.cue"],
  custom: {},
  ...overrides,
});

export const oraMock = (): unknown => ({
  start: vi.fn(() => oraMock()),
  fail: vi.fn(),
  succeed: vi.fn(),
  clear: vi.fn(),
  render: vi.fn(),
});
