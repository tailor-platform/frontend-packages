import type { Meta, StoryObj } from "@storybook/react";
import { Heading, HeadingProps } from "@tailor-platform/design-systems";

const meta = {
  title: "Standalone/Heading",
  component: Heading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<HeadingProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Heading {...args}>Heading</Heading>,
};
