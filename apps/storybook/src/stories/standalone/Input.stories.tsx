import type { Meta, StoryObj } from "@storybook/react";
import { Input, InputProps } from "@tailor-platform/design-systems";
import { input } from "@tailor-platform/styled-system/recipes";

const meta = {
  title: "Standalone/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["sm", "md", "lg", "xl", "2xl"] as InputProps["size"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<InputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: input.raw({ size: "md", variant: "outline" }),
  render: (args) => <Input {...args} />,
};
