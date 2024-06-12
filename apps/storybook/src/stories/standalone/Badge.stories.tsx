import type { Meta, StoryObj } from "@storybook/react";
import { Badge, BadgeProps } from "@tailor-platform/design-systems";

const meta = {
  title: "Standalone/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<BadgeProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Badge {...args}>Badge</Badge>,
};
