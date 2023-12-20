import { afterEach, describe, expect, it, vi } from "vitest";
import { setDatadogRumUser } from "./setDatadogRumUser";

const datadogMock = vi.hoisted(() => {
  return {
    onReady: vi.fn().mockImplementation((callback) =>
      // I can't type callback here so gave up
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      callback(),
    ),
    setUser: vi.fn(),
  };
});

vi.mock("@datadog/browser-rum", () => {
  return {
    datadogRum: datadogMock,
  };
});

describe("Datadog RUM User Setting", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should set Datadog RUM user correctly", () => {
    const user = { id: "1234", name: "TestUser" };

    setDatadogRumUser(user);
    expect(datadogMock.onReady).toBeCalled();
    expect(datadogMock.setUser).toBeCalledWith(user);
  });

  it("should not set Datadog RUM user if id is missing", () => {
    setDatadogRumUser({ id: "", name: "TestUser" });
    expect(datadogMock.onReady).not.toBeCalled();
    expect(datadogMock.setUser).not.toBeCalled();
  });
});
