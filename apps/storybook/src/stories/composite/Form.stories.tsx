"use client";

import { Form } from "@tailor-platform/design-systems/client";
import type { Meta, StoryObj } from "@storybook/react";
import { FormStory } from "./FormStory.tsx";
import formStorySource from "./FormStory.tsx?raw";

const meta = {
  title: "Composite/Form",
  component: Form.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => <FormStory />,
  parameters: {
    docs: {
      source: {
        code: formStorySource,
      },
    },
  },
};
