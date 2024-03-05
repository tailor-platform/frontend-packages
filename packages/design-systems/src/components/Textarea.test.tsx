import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Textarea } from "./Text";

describe("Textarea", () => {
  it("renders a Textarea component", () => {
    render(<Textarea placeholder="Textarea Placeholder" />);

    const textareaElement = screen.getByPlaceholderText("Textarea Placeholder");
    expect(textareaElement).not.toBeNull();
  });

  it("handles input correctly", async () => {
    render(<Textarea placeholder="Textarea Placeholder" />);

    const textareaElement = screen.getByPlaceholderText("Textarea Placeholder");
    const user = userEvent.setup();
    await user.type(textareaElement, "This is a test message");

    expect((textareaElement as HTMLInputElement).value).toBe(
      "This is a test message",
    );
  });
});
