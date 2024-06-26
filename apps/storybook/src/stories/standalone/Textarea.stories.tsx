import { Textarea } from "@tailor-platform/design-systems";
import { HTMLStyledProps } from "@tailor-platform/styled-system/jsx";
import type { Meta, StoryObj } from "@storybook/react";
import { TextareaStory } from "./TextareaStory.tsx";
import textareaStorySource from "./TextareaStory.tsx?raw";

const meta: Meta<HTMLStyledProps<"textarea">> = {
  title: "Standalone/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

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
