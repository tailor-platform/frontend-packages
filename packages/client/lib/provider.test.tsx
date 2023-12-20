import "cross-fetch/polyfill";
import { graphql, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { gql, useApolloClient } from "@apollo/client";
import { useState } from "react";
import { TailorProvider } from "./provider";

describe("TailorProvider", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("request", () => {
    const mockServer = setupServer(
      graphql.query("TestQuery", ({ request }) => {
        const authorization = request.headers.get("authorization");
        return HttpResponse.json({
          data: {
            result: authorization
              ? `with header: ${authorization}`
              : "no header",
          },
        });
      }),
    );

    beforeAll(() => {
      mockServer.listen();
    });
    afterAll(() => {
      mockServer.close();
    });

    const TestComponent = (props: { customContext?: object }) => {
      const [status, setStatus] = useState("none");
      const client = useApolloClient();
      const runRequest = async () => {
        const { data } = await client.query<{ result: string }>({
          query: gql`
            query TestQuery {
              result
            }
          `,
          context: props.customContext,
        });
        setStatus(data.result);
      };

      return (
        <>
          <div data-testid="status">{status}</div>
          <button data-testid="request" onClick={runRequest}>
            request
          </button>
        </>
      );
    };

    const returnGetTokenWith = (value: string | null) => (key: string) => {
      if (key == "token") {
        return value;
      } else {
        return localStorage.getItem(key);
      }
    };

    test("request (with LocalStorage)", async () => {
      const getItemSpy = vi
        .spyOn(Storage.prototype, "getItem")
        .mockImplementation(returnGetTokenWith("local-storage-token"));

      render(
        <TailorProvider>
          <TestComponent />
        </TailorProvider>,
      );

      const user = userEvent.setup();
      await user.click(screen.getByTestId("request"));
      expect(getItemSpy).toHaveBeenCalled();
      expect(screen.getByTestId("status").textContent).toBe(
        "with header: Bearer local-storage-token",
      );
    });

    test("request (with dynamic header)", async () => {
      render(
        <TailorProvider>
          <TestComponent
            customContext={{
              headers: {
                authorization: "Bearer dynamic-token",
              },
            }}
          />
        </TailorProvider>,
      );

      const user = userEvent.setup();
      await user.click(screen.getByTestId("request"));
      expect(screen.getByTestId("status").textContent).toBe(
        "with header: Bearer dynamic-token",
      );
    });

    test("request (dynamically overriding token in LocalStorage)", async () => {
      const getItemSpy = vi
        .spyOn(Storage.prototype, "getItem")
        .mockImplementation(returnGetTokenWith("local-storage-token"));

      render(
        <TailorProvider>
          <TestComponent
            customContext={{
              headers: {
                authorization: "Bearer dynamic-overriding-token",
              },
            }}
          />
        </TailorProvider>,
      );

      const user = userEvent.setup();
      await user.click(screen.getByTestId("request"));
      expect(getItemSpy).toHaveBeenCalled();
      expect(screen.getByTestId("status").textContent).toBe(
        "with header: Bearer dynamic-overriding-token",
      );
    });
  });

  describe("request returning 401", () => {
    const mockServer = setupServer(
      graphql.query("TestQuery", () => {
        return HttpResponse.json({}, { status: 401 });
      }),
    );

    const originalWindowLocation = window.location;

    beforeAll(() => {
      mockServer.listen();
    });

    afterEach(() => {
      window.location = originalWindowLocation;
    });

    afterAll(() => {
      mockServer.close();
    });

    const TestComponent2 = (props: { customHeaders?: object }) => {
      const client = useApolloClient();
      const runRequest = async () => {
        try {
          await client.query({
            query: gql`
              query TestQuery {
                result
              }
            `,
            context: {
              headers: props.customHeaders || {},
            },
          });
        } catch (e) {
          void 0;
        }
      };

      return (
        <>
          <button data-testid="request" onClick={runRequest}>
            request
          </button>
        </>
      );
    };

    test("redirects to the fallback login path", async () => {
      // we can't simply spy on the window.location.replace method, need to completely
      // replace the window.location object.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      delete (window as any).location;
      const replaceMock = vi.fn();
      window.location = { ...originalWindowLocation, replace: replaceMock };

      const spyRemoveItem = vi.spyOn(Storage.prototype, "removeItem");

      render(
        <TailorProvider fallbackLoginPath="/login">
          <TestComponent2 />
        </TailorProvider>,
      );

      const user = userEvent.setup();
      await user.click(screen.getByTestId("request"));
      expect(spyRemoveItem).toHaveBeenCalledWith("token");
      expect(spyRemoveItem).toHaveBeenCalledWith("user");
      expect(replaceMock).toHaveBeenCalledWith("/login");
    });
  });
});
