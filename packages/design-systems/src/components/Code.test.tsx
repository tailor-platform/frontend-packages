import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Code } from "./Code";

describe("<Code />", () => {
  it("renders the children correctly", () => {
    render(<Code>Hello, tailor!</Code>);
    expect(screen.getByText("Hello, tailor!")).not.toBeNull();
  });

  it("shows the copy button on hover", async () => {
    render(<Code>Hello, tailor!</Code>);
    const user = userEvent.setup();
    const codeElement = screen.getByText("Hello, tailor!");
    await act(() => user.hover(codeElement));
    await waitFor(() => expect(screen.getByText("Copy")).not.toBeNull());
  });

  it("hides the copy button when disableCopy is true", async () => {
    render(<Code disableCopy>Hello, tailor!</Code>);
    const user = userEvent.setup();
    const codeElement = screen.getByText("Hello, tailor!");
    await act(() => user.hover(codeElement));
    await waitFor(() => expect(screen.queryByText("Copy")).toBeNull());
  });

  it("handles copy button click correctly", async () => {
    const user = userEvent.setup();
    const clipboardSpy = vi.spyOn(navigator.clipboard, "writeText");
    render(<Code>Hello, tailor!</Code>);
    const codeElement = screen.getByText("Hello, tailor!");
    await act(() => user.hover(codeElement));
    const copyButton = screen.getByText("Copy");
    await act(() => user.click(copyButton));
    await waitFor(() =>
      expect(clipboardSpy).toHaveBeenCalledWith("Hello, tailor!"),
    );
  });
});
