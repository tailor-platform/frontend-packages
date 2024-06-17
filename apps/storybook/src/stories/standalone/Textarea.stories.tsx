import { Textarea, TextareaProps } from "@tailor-platform/design-systems";
import type { Meta, StoryObj } from "@storybook/react";
import { TextareaStory } from "./TextareaStory.tsx";
import textareaStorySource from "./TextareaStory.tsx?raw";

const meta = {
  title: "Standalone/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["sm", "md", "lg", "xl"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<TextareaProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <TextareaStory {...args}></TextareaStory>,
  parameters: {
    docs: {
      source: {
        code: textareaStorySource,
      },
    },
  },
};
