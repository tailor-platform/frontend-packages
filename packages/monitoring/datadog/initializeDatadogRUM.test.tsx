import { afterEach, describe, expect, it, vi } from "vitest";
import { datadogRum } from "@datadog/browser-rum";
import {
  defaultConfig,
  hasRequiredValues,
  initializeDatadogRUM,
} from "./initializeDatadogRUM";

vi.mock("@datadog/browser-rum", () => {
  return {
    datadogRum: {
      init: vi.fn(),
      startSessionReplayRecording: vi.fn(),
    },
  };
});

describe("Datadog RUM Initialization", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize Datadog RUM correctly", () => {
    initializeDatadogRUM();
    expect(hasRequiredValues(defaultConfig)).toBe(true);
    expect(datadogRum.init).toBeCalledWith(defaultConfig);
  });

  it("should not initialize Datadog RUM if required values are missing", () => {
    initializeDatadogRUM({ applicationId: undefined });
    expect(datadogRum.init).not.toBeCalled();
  });

  it("should override default configuration if provided", () => {
    const customConfig = { service: "custom-service" };
    initializeDatadogRUM(customConfig);

    expect(datadogRum.init).toBeCalledWith({
      ...defaultConfig,
      ...customConfig,
    });
  });
});
