import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { VStack } from "@tailor-platform/styled-system/jsx";
import { Form } from "./Form";
import { Button } from "./Button";
import { Input } from "./Input";

// supress "Not implemented: window.alert" error in testing
window.alert = () => void 0;

const TestForm = () => {
  const FormSchema = z
    .object({
      userId: z.string().min(1, "Username is required."),
      email: z.string().min(1, "Email is required."),
    })
    .required();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: "",
      email: "",
    },
  });

  const handleFormSubmit = (data: { userId: string; email: string }) => {
    window.alert(`${data.userId}, ${data.email}`);
  };

  return (
    <Form.Root {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <VStack>
          <Form.Field
            control={form.control}
            name="userId"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Username</Form.Label>
                <Form.Control>
                  <Input placeholder="Username" {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field
            control={form.control}
            name="email"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Email</Form.Label>
                <Form.Control>
                  <Input placeholder="Email" {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Button variant="primary" size="lg" width="full" type="submit" mt={4}>
            Submit
          </Button>
        </VStack>
      </form>
    </Form.Root>
  );
};

describe("TestForm", () => {
  it("submits the form with input data", async () => {
    const alertSpy = vi.spyOn(window, "alert");
    render(<TestForm />);
    const user = userEvent.setup();
    await act(() =>
      user.type(screen.getByPlaceholderText("Username"), "testUser"),
    );
    await act(() =>
      user.type(screen.getByPlaceholderText("Email"), "test@example.com"),
    );
    await act(() => user.click(screen.getByRole("button", { name: "Submit" })));
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith("testUser, test@example.com"),
    );
  });

  describe("TestForm Validation", () => {
    it("shows an error message for empty username", async () => {
      render(<TestForm />);
      const user = userEvent.setup();
      await act(() =>
        user.click(screen.getByRole("button", { name: "Submit" })),
      );
      await waitFor(() => {
        expect(screen.getByText("Username is required.")).not.toBeNull();
      });
    });
  });
});
