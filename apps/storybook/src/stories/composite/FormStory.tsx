"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { Form } from "@tailor-platform/design-systems/client";
import { Button, Input } from "@tailor-platform/design-systems";
import { VStack } from "@tailor-platform/styled-system/jsx";

type FormInput = {
  userId: string;
  email: string;
};

const handleFormSubmit: SubmitHandler<FormInput> = (form) => {
  window.alert(`${form.userId}, ${form.email}`);
};

const FormSchema = z
  .object({
    userId: z.string().min(1, "Username is required."),
    email: z.string().min(1, "Email is required."),
  })
  .required();

export const FormStory = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: "",
      email: "",
    },
  });
  return (
    <Form.Root {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="w-2/3 space-y-6"
      >
        <VStack>
          <Form.Field
            control={form.control}
            name="userId"
            render={({ field }) => (
              <Form.Item w="full">
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
              <Form.Item w="full">
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
