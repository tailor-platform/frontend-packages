import { NextRequest } from "next/server";
import { Mock } from "vitest";

// we can't simply spy on the window.location.replace method.
// this is a helper function to completely replace the window.location object.
export const withMockedReplace = async (
  replaceMock: Mock,
  test: () => Promise<void> | void,
) => {
  const originalWindowLocation = window.location;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  delete (window as any).location;
  window.location = { ...originalWindowLocation, replace: replaceMock };

  await test();

  window.location = originalWindowLocation;
};

export const buildRequestWithParams = (
  base: string,
  params?: URLSearchParams,
) => new NextRequest(new Request(`${base}?${params?.toString()}`));
