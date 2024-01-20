import { vi } from "vitest";
import { Resource } from "../interfaces/resource.js";
import { Deptools } from "../interfaces/deptools.js";
import { DockerCompose } from "../interfaces/docker.js";
import { Cuelang } from "../interfaces/cuelang.js";
import { Tailorctl } from "../interfaces/tailorctl.js";
import { UsecaseDeps } from "../support/usecase.js";
import { ConfigContent } from "../support/config.js";

export const buildMockConfig = (
  overrides?: Partial<ConfigContent>,
): ConfigContent => ({
  version: "v1",
  name: "mockapp",
  port: 8000,
  manifest: "manifest/config/template",
  target: ["tailordb.cue"],
  ...overrides,
});

export const buildMockDeps = (): UsecaseDeps => {
  const mockResource = buildMockResource();
  const mockDeptools = buildMockDeptools();
  const mockDockerCompose = buildMockDockerCompose();
  const mockCuelang = buildMockCuelang();
  const mockTailorctl = buildMockTailorctl();
  return {
    resource: mockResource,
    deptools: mockDeptools,
    dockerCompose: mockDockerCompose,
    cuelang: mockCuelang,
    tailorctl: mockTailorctl,
  };
};

export const buildMockResource = (overrides?: Partial<Resource>) => ({
  deleteAll: vi.fn(),
  existsComposeConfig: vi.fn(),
  copyCueMod: vi.fn(),
  createGeneratedDist: vi.fn(),
  createComposeConfig: vi.fn(),
  createInitSQL: vi.fn(),
  createEmptyLogFile: vi.fn(),
  ...overrides,
});

export const buildMockDeptools = (overrides?: Partial<Deptools>) => ({
  deleteAll: vi.fn(),
  downloadCuelang: vi.fn((version) => ({
    packageName: `mock_cuelang_${version}`,
    promise: Promise.resolve(),
  })),
  downloadTailorctl: vi.fn((version) => ({
    packageName: `mock_tailorctl_${version}`,
    promise: Promise.resolve(),
  })),
  ...overrides,
});

export const buildMockDockerCompose = (overrides?: Partial<DockerCompose>) => ({
  down: vi.fn(),
  up: vi.fn(),
  import: vi.fn(),
  apply: vi.fn(),
  ...overrides,
});

export const buildMockCuelang = (overrides?: Partial<Cuelang>) => ({
  vet: vi.fn(),
  eval: vi.fn(),
  ...overrides,
});

export const buildMockTailorctl = (overrides?: Partial<Tailorctl>) => ({
  sync: vi.fn(),
  tidy: vi.fn(),
  apps: vi.fn(() =>
    Promise.resolve([
      {
        created: "2023-04-01 05:00:30.001000",
        updated: "2023-03-01 05:00:30.001000",
        domain: "dummy.mini.tailor.tech",
        name: "dummy",
      },
    ]),
  ),
  apply: vi.fn(),
  destroy: vi.fn(),
  createWorkspace: vi.fn(),
  createVault: vi.fn(),
  ...overrides,
});

export const oraMock = (): unknown => ({
  start: vi.fn(() => oraMock()),
  fail: vi.fn(),
  succeed: vi.fn(),
  clear: vi.fn(),
  render: vi.fn(),
});
