"use client";

import { Form } from "@tailor-platform/design-systems/client";
import type { Meta, StoryObj } from "@storybook/react";
import { FormStory } from "./FormStory.tsx";
import formStorySource from "./FormStory.tsx?raw";

const meta: Meta<typeof Form> = {
  title: "Composite/Form",
  component: Form.Root as Meta["component"],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <FormStory />,
  parameters: {
    docs: {
      source: {
        code: formStorySource,
      },
    },
  },
};
